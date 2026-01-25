var A={"align-left":`
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        </svg>
    `,"align-center":`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="5" width="12" height="2" rx="1" />
            <rect x="8" y="9" width="8" height="2" rx="1" />
            <rect x="6" y="13" width="12" height="2" rx="1" />
            <rect x="8" y="17" width="8" height="2" rx="1" />
        </svg>
    `,"align-right":`
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
        </svg>
    `,"align-justify":`
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
        </svg>
    `,spoiler:`
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    `,curator:`
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
    `,"format-paragraphs":`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 4v16"/>
            <path d="M17 4v16"/>
            <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"/>
        </svg>
    `},v={alignLeft:t=>p(t,"align-left","Align left"),alignCenter:t=>p(t,"align-center","Align center"),alignRight:t=>p(t,"align-right","Align right"),alignJustify:t=>p(t,"align-justify","Justify"),spoiler:t=>({name:"spoiler",className:"markdown-editor-extended-icon markdown-editor-extended-spoiler",title:"Spoiler",action:()=>_(t)}),curator:t=>({name:"curator",className:"markdown-editor-extended-icon markdown-editor-extended-curator",title:"Insert Media",action:()=>T(t)}),formatParagraphs:t=>({name:"format-paragraphs",className:"markdown-editor-extended-icon markdown-editor-extended-format-paragraphs",title:"Convert line breaks to paragraphs",action:()=>P(t)})};function p(t,o,r){return{name:o,className:`markdown-editor-extended-icon markdown-editor-extended-${o}`,title:r,action:()=>F(t,`:::${o}`)}}function E(){if(document.getElementById("markdown-editor-extended-icons"))return;let t=document.createElement("style");t.id="markdown-editor-extended-icons",t.textContent=b(),document.head.appendChild(t)}function b(){let t=".editor-toolbar",o=`
${t} a.markdown-editor-extended-icon,
${t} button.markdown-editor-extended-icon {
    position: relative;
    text-indent: -9999px;
}

${t} a.markdown-editor-extended-icon::before,
${t} button.markdown-editor-extended-icon::before {
    content: '';
    display: inline-block;
    width: 1.1rem;
    height: 1.1rem;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: 1.1rem;
}
`,r=Object.entries(A).map(([e,n])=>{let i=B(n);return`
${t} .markdown-editor-extended-${e}::before {
    -webkit-mask-image: url('${i}');
    mask-image: url('${i}');
}
`}).join(`
`);return`${o}
${r}`}function B(t){return`data:image/svg+xml,${encodeURIComponent(t.replace(/\s+/g," ").trim()).replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29")}`}function F(t,o){let r=x(t);if(!r?.codemirror)return;let e=r.codemirror,n=e.getDoc(),i=n.getSelection(),s=`${o}
${i||""}
:::`;if(n.replaceSelection(s),!i){let g=n.getCursor();n.setCursor({line:g.line-1,ch:o.length})}e.focus()}function M(t){if(!t||t.__markdownEditorExtendedPatched||typeof t.getToolbarButton!="function")return t;E();let o=t.getToolbarButton.bind(t);return t.getToolbarButton=function(r){return v[r]?v[r](t):o(r)},t.__markdownEditorExtendedPatched=!0,t}function x(t){return t?.editor??t}function _(t){let o=x(t);if(!o?.codemirror)return;let r=o.codemirror,e=r.getDoc(),n="||",i="||",l=e.somethingSelected(),s=e.getCursor("from"),g=e.getCursor("to"),c=e.indexFromPos(s),a=e.indexFromPos(g);if(l){let d=e.getSelection(),h=d.startsWith(n)&&d.endsWith(i)&&d.length>=n.length+i.length,w=c>=n.length?e.getRange(e.posFromIndex(c-n.length),s):"",$=e.getRange(g,e.posFromIndex(a+i.length)),y=w===n&&$===i;if(h){let u=d.slice(n.length,d.length-i.length);e.replaceRange(u,s,g);let m=c+u.length;e.setSelection(s,e.posFromIndex(m))}else if(y){let u=e.posFromIndex(a),m=e.posFromIndex(a+i.length);e.replaceRange("",u,m);let f=e.posFromIndex(c-n.length);e.replaceRange("",f,s);let I=c-n.length,S=a-n.length;e.setSelection(e.posFromIndex(I),e.posFromIndex(S))}else{let u=`${n}${d}${i}`;e.replaceRange(u,s,g);let m=e.posFromIndex(c+n.length),f=e.posFromIndex(c+n.length+d.length);e.setSelection(m,f)}}else{let d="spoiler",h=`${n}${d}${i}`;e.replaceRange(h,s);let k=e.posFromIndex(c+n.length),w=e.posFromIndex(c+n.length+d.length);e.setSelection(k,w)}r.focus()}function P(t){let o=x(t);if(!o?.codemirror)return;let r=o.codemirror,e=r.getDoc(),n=e.somethingSelected(),i,l,s;n?(i=e.getSelection(),l=e.getCursor("from"),s=e.getCursor("to")):(i=e.getValue(),l={line:0,ch:0},s={line:e.lineCount()-1,ch:e.getLine(e.lineCount()-1).length});let g=i.replace(/\n{3,}/g,`

`).replace(/([^\n])\n(?!\n)(?![-*+#>\d`|])/g,`$1

`);n?e.replaceRange(g,l,s):e.setValue(g),r.focus()}function C(){let t=window.Alpine;if(!t||t.data.__markdownEditorExtendedPatched)return!!t;let o=t.data.bind(t);return t.data=function(r,e){return r!=="markdownEditorFormComponent"?o(r,e):o(r,function(...n){let i=e(...n);return M(i)})},t.data.__markdownEditorExtendedPatched=!0,!0}C()||document.addEventListener("alpine:init",()=>{C()},{once:!0});function T(t){let o=t.$wire,r=t.$root;if(!o){console.warn("Curator: $wire not found on component");return}if(!r){console.warn("Curator: $root not found on component");return}let e=r.id;if(!e){console.warn("Curator: Could not determine component key from $root.id");return}let n=`curator-panel-${e.replace(/\./g,"-")}`;window.dispatchEvent(new CustomEvent("open-modal",{detail:{id:n}}))}document.addEventListener("markdown-curator-insert",t=>{let o=t.detail;Array.isArray(o)&&(o=o[0]);let{key:r}=o||{},e=o?.media;if(Array.isArray(e)&&e.length>0&&e[0]?.media&&Array.isArray(e[0].media)&&(e=e[0].media),!r){console.warn("Curator: Missing key in event detail");return}if(!e||Array.isArray(e)&&e.length===0){console.warn("Curator: Missing media in event detail");return}if(!window.Alpine){console.warn("Curator: Alpine not found");return}let n=document.getElementById(r);if(!n){console.warn("Curator: Could not find editor element with id:",r);return}try{let l=window.Alpine.$data(n)?.editor;if(l&&l.codemirror){let s=l.codemirror,c=(Array.isArray(e)?e:[e]).map(a=>{let d=a.url||a.large_url||a.medium_url||a.thumbnail_url;return`![${a.alt||a.title||a.pretty_name||a.name||""}](${d})`}).join(`
`);s.replaceSelection(c),s.focus()}else console.warn("Curator: Could not find codemirror instance")}catch(i){console.error("Curator: Error inserting media",i)}});
