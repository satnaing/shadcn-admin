/**
 * Mock canvas: a static document that draws section cards from `postMessage`.
 * shortcut: replaced by the real Next.js front (`?preview=<token>` iframe) when API 72 exists (Q-B1).
 * Content is only ever inserted with `textContent` — never as HTML.
 */
export const PREVIEW_DOC = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{margin:0;font:14px system-ui,sans-serif;background:#fff;color:#111}
.empty{padding:96px 16px;text-align:center;color:#888}
.sec{margin:8px;padding:24px 16px;border:1px dashed #cbd5e1;border-radius:8px;cursor:pointer}
.sec small{display:block;color:#64748b;margin-bottom:6px;text-transform:uppercase;letter-spacing:.05em;font-size:11px}
.sec b{font-size:16px}.sec.sel{border:2px solid #2563eb;background:#eff6ff}.sec.off{opacity:.4}.sec.miss{border-color:#dc2626;background:#fef2f2}
</style></head><body><div id="root"></div><script>
var root=document.getElementById('root');
function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
window.addEventListener('message',function(ev){
  var m=ev.data;if(!m||m.type!=='sections')return;
  root.textContent='';
  if(!m.sections.length){root.appendChild(el('div','empty',m.emptyText));return}
  m.sections.forEach(function(s){
    var c=el('div','sec'+(s.id===m.selectedId?' sel':'')+(s.hidden?' off':'')+(s.missing?' miss':''));
    c.appendChild(el('small','',s.category));
    c.appendChild(el('b','',s.title));
    if(s.summary)c.appendChild(el('div','',s.summary));
    c.addEventListener('click',function(){parent.postMessage({type:'select',id:s.id},'*')});
    root.appendChild(c);
  });
});
parent.postMessage({type:'ready'},'*');
</script></body></html>`
