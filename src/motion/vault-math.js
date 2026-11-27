export const wrap=(n,m)=>((n%m)+m)%m;
export const nearest=(position,count)=>count?wrap(Math.round(position),count):-1;
export const settle=(position,velocity)=>Math.round(position+Math.max(-18,Math.min(18,velocity*190)));
export function randomTarget(position,winner,count){if(count<2)return Math.round(position);const base=Math.round(position),offset=wrap(winner-wrap(base,count),count);return base+offset+(offset<12?count:0);}
