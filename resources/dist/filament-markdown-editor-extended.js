var E={"align-left":`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <rect x="4" y="5" width="12" height="2" rx="1" />
            <rect x="4" y="9" width="8" height="2" rx="1" />
            <rect x="4" y="13" width="12" height="2" rx="1" />
            <rect x="4" y="17" width="8" height="2" rx="1" />
        </svg>
    `,"align-center":`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="5" width="12" height="2" rx="1" />
            <rect x="8" y="9" width="8" height="2" rx="1" />
            <rect x="6" y="13" width="12" height="2" rx="1" />
            <rect x="8" y="17" width="8" height="2" rx="1" />
        </svg>
    `,"align-right":`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <rect x="8" y="5" width="12" height="2" rx="1" />
            <rect x="12" y="9" width="8" height="2" rx="1" />
            <rect x="8" y="13" width="12" height="2" rx="1" />
            <rect x="12" y="17" width="8" height="2" rx="1" />
        </svg>
    `,"align-justify":`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <rect x="4" y="5" width="16" height="2" rx="1" />
            <rect x="4" y="9" width="16" height="2" rx="1" />
            <rect x="4" y="13" width="16" height="2" rx="1" />
            <rect x="4" y="17" width="16" height="2" rx="1" />
        </svg>
    `,spoiler:`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <path d="M12 5c4.79 0 8.7 3.05 10 7-1.3 3.95-5.21 7-10 7s-8.7-3.05-10-7c1.3-3.95 5.21-7 10-7zm0 4a3 3 0 100 6 3 3 0 000-6z" />
            <path d="M6 18.5L18.5 6 19.9 7.4 7.4 19.9z" />
        </svg>
    `},k={alignLeft:e=>x(e,"align-left","Align left"),alignCenter:e=>x(e,"align-center","Align center"),alignRight:e=>x(e,"align-right","Align right"),alignJustify:e=>x(e,"align-justify","Justify"),spoiler:e=>({name:"spoiler",className:"markdown-editor-extended-icon markdown-editor-extended-spoiler",title:"Spoiler",action:()=>_(e)})};function x(e,o,r){return{name:o,className:`markdown-editor-extended-icon markdown-editor-extended-${o}`,title:r,action:()=>T(e,`:::${o}`)}}function F(){if(document.getElementById("markdown-editor-extended-icons"))return;let e=document.createElement("style");e.id="markdown-editor-extended-icons",e.textContent=C(),document.head.appendChild(e)}function C(){let e=".editor-toolbar",o=`
${e} a.markdown-editor-extended-icon,
${e} button.markdown-editor-extended-icon {
    position: relative;
    text-indent: -9999px;
}

${e} a.markdown-editor-extended-icon::before,
${e} button.markdown-editor-extended-icon::before {
    content: '';
    display: inline-block;
    width: 1.1rem;
    height: 1.1rem;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: 1.1rem;
}
`,r=Object.entries(E).map(([t,n])=>{let i=B(n);return`
${e} .markdown-editor-extended-${t}::before {
    -webkit-mask-image: url('${i}');
    mask-image: url('${i}');
}
`}).join(`
`);return`${o}
${r}`}function B(e){return`data:image/svg+xml,${encodeURIComponent(e.replace(/\s+/g," ").trim()).replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29")}`}function T(e,o){let r=I(e);if(!r?.codemirror)return;let t=r.codemirror,n=t.getDoc(),i=n.getSelection(),c=`${o}
${i||""}
:::`;if(n.replaceSelection(c),!i){let l=n.getCursor();n.setCursor({line:l.line-1,ch:o.length})}t.focus()}function R(e){if(!e||e.__markdownEditorExtendedPatched||typeof e.getToolbarButton!="function")return e;F();let o=e.getToolbarButton.bind(e);return e.getToolbarButton=function(r){return k[r]?k[r](e):o(r)},e.__markdownEditorExtendedPatched=!0,e}function I(e){return e?.editor??e}function _(e){let o=I(e);if(!o?.codemirror)return;let r=o.codemirror,t=r.getDoc(),n="||",i="||",p=t.somethingSelected(),c=t.getCursor("from"),l=t.getCursor("to"),s=t.indexFromPos(c),h=t.indexFromPos(l);if(p){let d=t.getSelection(),w=d.startsWith(n)&&d.endsWith(i)&&d.length>=n.length+i.length,u=s>=n.length?t.getRange(t.posFromIndex(s-n.length),c):"",S=t.getRange(l,t.posFromIndex(h+i.length)),v=u===n&&S===i;if(w){let a=d.slice(n.length,d.length-i.length);t.replaceRange(a,c,l);let g=s+a.length;t.setSelection(c,t.posFromIndex(g))}else if(v){let a=t.posFromIndex(h),g=t.posFromIndex(h+i.length);t.replaceRange("",a,g);let m=t.posFromIndex(s-n.length);t.replaceRange("",m,c);let $=s-n.length,b=h-n.length;t.setSelection(t.posFromIndex($),t.posFromIndex(b))}else{let a=`${n}${d}${i}`;t.replaceRange(a,c,l);let g=t.posFromIndex(s+n.length),m=t.posFromIndex(s+n.length+d.length);t.setSelection(g,m)}}else{let d="spoiler",w=`${n}${d}${i}`;t.replaceRange(w,c);let f=t.posFromIndex(s+n.length),u=t.posFromIndex(s+n.length+d.length);t.setSelection(f,u)}r.focus()}function y(){let e=window.Alpine;if(!e||e.data.__markdownEditorExtendedPatched)return!!e;let o=e.data.bind(e);return e.data=function(r,t){return r!=="markdownEditorFormComponent"?o(r,t):o(r,function(...n){let i=t(...n);return R(i)})},e.data.__markdownEditorExtendedPatched=!0,!0}y()||document.addEventListener("alpine:init",()=>{y()},{once:!0});
