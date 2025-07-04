const palavroes = [
    { palavra: "porra", regex: /p[o0óòôõº]r[rř]a[@a4áàâãä]/gi },
    { palavra: "merda", regex: /m[e3éèêë]r[dcl][a@áàâãä4]/gi },
    { palavra: "caralho", regex: /c[a@áàâãä4]r[a@áàâãä4]lh[o0óòôõ]/gi },
    { palavra: "bosta", regex: /b[o0óòôõ]st[a@áàâãä4]/gi },
    { palavra: "puta", regex: /p[uúùûü]t[a@áàâãä4]/gi },
    { palavra: "foda", regex: /f[o0óòôõ]d[a@áàâãä4]/gi },
    { palavra: "fodase", regex: /f[o0óòôõ]d[a@áàâãä4]s[e3éèêë]/gi },
    { palavra: "cu", regex: /c[uúùûü]/gi },
    { palavra: "cacete", regex: /c[a@áàâãä4]c[e3éèêë]t[e3éèêë]/gi },
    { palavra: "vai tomar no cu", regex: /v[a@áàâãä4]i\s*t[o0óòôõ]m[a@áàâãä4]r\s*n[o0óòôõ]\s*c[uúùûü]/gi },
    { palavra: "escroto", regex: /e[s5$][cç][rř][o0óòôõ]t[o0óòôõ]/gi },
    { palavra: "corno", regex: /c[o0óòôõ]rn[o0óòôõ]/gi },
    { palavra: "fdp", regex: /f[dcl][p]/gi },
    { palavra: "arrombado", regex: /a[rř][rř]o[mn][b8][a@áàâãä4]d[o0óòôõ]/gi },
    { palavra: "vagabundo", regex: /v[a@áàâãä4]g[a@áàâãä4]b[uúùûü]nd[o0óòôõ]/gi },
    { palavra: "viado", regex: /v[i1íìîï][a@áàâãä4]d[o0óòôõ]/gi },
    { palavra: "desgraçado", regex: /d[e3éèêë]s[g9]r[a@áàâãä4]ç[a@áàâãä4]d[o0óòôõ]/gi },
    { palavra: "pau no cu", regex: /p[a@áàâãä4]u\s*n[o0óòôõ]\s*c[uúùûü]/gi },
    { palavra: "inferno", regex: /[i1íìîï]n[fph][e3éèêë]rn[o0óòôõ]/gi },
    { palavra: "maldito", regex: /m[a@áàâãä4]ld[i1íìîï]t[o0óòôõ]/gi },
    { palavra: "puta que pariu", regex: /p[uúùûü]t[a@áàâãä4]\s*q[uúùûü][e3éèêë]\s*p[a@áàâãä4]r[i1íìîï]u/gi },
    { palavra: "desgraça", regex: /d[e3éèêë]s[g9]r[a@áàâãä4]ç[a@áàâãä4]/gi },
    { palavra: "retardado", regex: /r[e3éèêë]t[a@áàâãä4]rd[a@áàâãä4]d[o0óòôõ]/gi },
    { palavra: "crlh", regex: /c[rř][l1][h]/gi },
    { palavra: "krl", regex: /k[rř][l1]/gi },
    { palavra: "porcaria", regex: /p[o0óòôõ]rc[a@áàâãä4]r[i1íìîï]a/gi },
    { palavra: "maluco do c*", regex: /m[a@áàâãä4]l[uúùûü]c[o0óòôõ]\s*d[o0óòôõ]\s*c[\*]/gi },
    { palavra: "pentelho", regex: /p[e3éèêë]nt[e3éèêë]lh[o0óòôõ]/gi },
    { palavra: "piranha", regex: /p[i1íìîï]r[a@áàâãä4]nh[a@áàâãä4]/gi },
    { palavra: "babaca", regex: /b[a@áàâãä4]b[a@áàâãä4]c[a@áàâãä4]/gi },
    { palavra: "otário", regex: /[o0óòôõ]t[a@áàâãä4]r[i1íìîï][o0óòôõ]/gi },
    { palavra: "imbecil", regex: /[i1íìîï]mb[e3éèêë]c[i1íìîï]l/gi },
];
export function censurarTexto(texto) {
    let textoCensurado = texto

    palavroes.forEach(({ regex }) => {
        textoCensurado = textoCensurado.replace(regex, (match) => {
            return "*".repeat(match.length);
        });
    });
    return textoCensurado

}

export function contemPalavrao(texto) {
    return palavroes.some(({ regex }) => regex.test(texto))
}
