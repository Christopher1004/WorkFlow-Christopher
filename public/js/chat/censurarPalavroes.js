const palavroes = [
    { palavra: "porra", regex: /\bp[o0óòôõº]r[rř]a[@a4áàâãä]\b/gi },
    { palavra: "merda", regex: /\bm[e3éèêë]r[dcl][a@áàâãä4]\b/gi },
    { palavra: "caralho", regex: /\bc[a@áàâãä4]r[a@áàâãä4]lh[o0óòôõ]\b/gi },
    { palavra: "bosta", regex: /\bb[o0óòôõ]st[a@áàâãä4]\b/gi },
    { palavra: "puta", regex: /\bp[uúùûü]t[a@áàâãä4]\b/gi },
    { palavra: "foda", regex: /\bf[o0óòôõ]d[a@áàâãä4]\b/gi },
    { palavra: "fodase", regex: /\bf[o0óòôõ]d[a@áàâãä4]s[e3éèêë]\b/gi },
    { palavra: "cu", regex: /\bc[uúùûü]\b/gi },
    { palavra: "cacete", regex: /\bc[a@áàâãä4]c[e3éèêë]t[e3éèêë]\b/gi },
    { palavra: "vai tomar no cu", regex: /\bv[a@áàâãä4]i\s*t[o0óòôõ]m[a@áàâãä4]r\s*n[o0óòôõ]\s*c[uúùûü]\b/gi },
    { palavra: "escroto", regex: /\be[s5$][cç][rř][o0óòôõ]t[o0óòôõ]\b/gi },
    { palavra: "corno", regex: /\bc[o0óòôõ]rn[o0óòôõ]\b/gi },
    { palavra: "fdp", regex: /\bf[dcl][p]\b/gi },
    { palavra: "arrombado", regex: /\ba[rř][rř]o[mn][b8][a@áàâãä4]d[o0óòôõ]\b/gi },
    { palavra: "vagabundo", regex: /\bv[a@áàâãä4]g[a@áàâãä4]b[uúùûü]nd[o0óòôõ]\b/gi },
    { palavra: "viado", regex: /\bv[i1íìîï][a@áàâãä4]d[o0óòôõ]\b/gi },
    { palavra: "desgraçado", regex: /\bd[e3éèêë]s[g9]r[a@áàâãä4]ç[a@áàâãä4]d[o0óòôõ]\b/gi },
    { palavra: "pau no cu", regex: /\bp[a@áàâãä4]u\s*n[o0óòôõ]\s*c[uúùûü]\b/gi },
    { palavra: "inferno", regex: /\b[i1íìîï]n[fph][e3éèêë]rn[o0óòôõ]\b/gi },
    { palavra: "maldito", regex: /\bm[a@áàâãä4]ld[i1íìîï]t[o0óòôõ]\b/gi },
    { palavra: "puta que pariu", regex: /\bp[uúùûü]t[a@áàâãä4]\s*q[uúùûü][e3éèêë]\s*p[a@áàâãä4]r[i1íìîï]u\b/gi },
    { palavra: "desgraça", regex: /\bd[e3éèêë]s[g9]r[a@áàâãä4]ç[a@áàâãä4]\b/gi },
    { palavra: "retardado", regex: /\br[e3éèêë]t[a@áàâãä4]rd[a@áàâãä4]d[o0óòôõ]\b/gi },
    { palavra: "crlh", regex: /\bc[rř][l1][h]\b/gi },
    { palavra: "krl", regex: /\bk[rř][l1]\b/gi },
    { palavra: "porcaria", regex: /\bp[o0óòôõ]rc[a@áàâãä4]r[i1íìîï]a\b/gi },
    { palavra: "maluco do c*", regex: /\bm[a@áàâãä4]l[uúùûü]c[o0óòôõ]\s*d[o0óòôõ]\s*c[\*]\b/gi },
    { palavra: "pentelho", regex: /\bp[e3éèêë]nt[e3éèêë]lh[o0óòôõ]\b/gi },
    { palavra: "piranha", regex: /\bp[i1íìîï]r[a@áàâãä4]nh[a@áàâãä4]\b/gi },
    { palavra: "babaca", regex: /\bb[a@áàâãä4]b[a@áàâãä4]c[a@áàâãä4]\b/gi },
    { palavra: "otário", regex: /\b[o0óòôõ]t[a@áàâãä4]r[i1íìîï][o0óòôõ]\b/gi },
    { palavra: "imbecil", regex: /\b[i1íìîï]mb[e3éèêë]c[i1íìîï]l\b/gi },
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
