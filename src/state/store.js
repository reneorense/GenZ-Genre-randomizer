export function filterGenres(genres,category='ALL',query=''){const q=query.trim().toLowerCase();return genres.filter(g=>(category==='ALL'||g.category===category)&&(!q||[g.name,g.subtag,g.description,...g.artists].some(s=>s.toLowerCase().includes(q))));}
export function chooseGenre(pool,currentId,rng=Math.random){const candidates=pool.length>1?pool.filter(g=>g.id!==currentId):pool;return candidates.length?candidates[Math.min(candidates.length-1,Math.floor(rng()*candidates.length))]:null;}
export function cleanIds(value,genres){return Array.isArray(value)?[...new Set(value.filter(id=>genres.some(g=>g.id===id)))]:[];}
export function addRecent(ids,id){return [id,...ids.filter(v=>v!==id)].slice(0,50);}
export const state={category:'ALL',query:'',current:null,busy:false,saved:[],recent:[],tab:'saved',sound:false,instant:false};
