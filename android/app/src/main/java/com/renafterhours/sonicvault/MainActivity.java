package com.renafterhours.sonicvault;

import android.app.Activity;
import android.content.Intent;
import android.content.ActivityNotFoundException;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Message;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.widget.Toast;
import androidx.webkit.WebViewAssetLoader;
import java.io.ByteArrayInputStream;

public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String HOME = "https://" + HOST + "/assets/index.html";
    private WebView web;
    private WebViewAssetLoader assets;
    private boolean local(Uri u) {
        return "https".equals(u.getScheme()) && HOST.equals(u.getHost()) && u.getPath()!=null && u.getPath().startsWith("/assets/");
    }
    private boolean external(Uri u) {
        if (!"https".equals(u.getScheme())) return true;
        String host=u.getHost();
        if (host==null || !(host.equals("open.spotify.com") || host.equals("music.youtube.com") || host.equals("www.youtube.com") || host.equals("reneorense.github.io"))) return true;
        try { startActivity(new Intent(Intent.ACTION_VIEW,u)); }
        catch(ActivityNotFoundException ex) { Toast.makeText(this,"No app available to open this link",Toast.LENGTH_SHORT).show(); }
        return true;
    }
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        assets = new WebViewAssetLoader.Builder().addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        web=new WebView(this);
        web.setBackgroundColor(Color.rgb(16,16,21));
        WebSettings s=web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setSupportMultipleWindows(true);
        s.setJavaScriptCanOpenWindowsAutomatically(false);
        s.setMediaPlaybackRequiresUserGesture(true);
        web.setWebViewClient(new WebViewClient(){
            @Override public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                if(local(r.getUrl())) {
                    WebResourceResponse response=assets.shouldInterceptRequest(r.getUrl());
                    if(response!=null) return response;
                }
                return new WebResourceResponse("text/plain","UTF-8",new ByteArrayInputStream(new byte[0]));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r) {
                return !local(r.getUrl()) && external(r.getUrl());
            }
            @Override public void onPageFinished(WebView v,String url) {
                if(local(Uri.parse(url))) v.evaluateJavascript("document.querySelectorAll('a[target=_blank]').forEach(a=>a.removeAttribute('target'));",null);
            }
        });
        web.setWebChromeClient(new WebChromeClient(){
            @Override public boolean onCreateWindow(WebView view,boolean dialog,boolean gesture,Message result) {
                if(!gesture) return false;
                WebView popup=new WebView(MainActivity.this);
                popup.setWebViewClient(new WebViewClient(){
                    @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest req){
                        external(req.getUrl());v.post(v::destroy);return true;
                    }
                    @Override public WebResourceResponse shouldInterceptRequest(WebView v,WebResourceRequest req){
                        return new WebResourceResponse("text/plain","UTF-8",new ByteArrayInputStream(new byte[0]));
                    }
                });
                ((WebView.WebViewTransport)result.obj).setWebView(popup);
                result.sendToTarget(); return true;
            }
        });
        setContentView(web);
        if(state==null || web.restoreState(state)==null) web.loadUrl(HOME);
    }
    @Override public void onSaveInstanceState(Bundle out){web.saveState(out);super.onSaveInstanceState(out);}
    @Override protected void onPause(){web.onPause();super.onPause();}
    @Override protected void onResume(){super.onResume();web.onResume();}
    @Override public void onBackPressed(){
        web.evaluateJavascript("(()=>{const d=document.querySelector('dialog[open]');if(d){d.close();return true}return false})()",value->{if(!"true".equals(value)){if(web.canGoBack())web.goBack();else finish();}});
    }
    @Override protected void onDestroy(){if(web!=null){web.stopLoading();web.destroy();}super.onDestroy();}
}
