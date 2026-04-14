{\rtf1\mac\ansicpg10000\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 let myChart = null;\
\
// FUNC\uc0\u538 IA DE NAVIGARE\
function showPage(pageId) \{\
    // Ascunde toate paginile\
    document.querySelectorAll('.page').forEach(page => \{\
        page.style.display = 'none';\
    \});\
    // Arat\uc0\u259  pagina cerut\u259 \
    document.getElementById('page-' + pageId).style.display = 'block';\
    \
    // Update meniu activ\
    document.querySelectorAll('.nav-item').forEach(item => \{\
        item.classList.remove('active');\
        if(item.innerText.toLowerCase().includes(pageId)) \{\
            item.classList.add('active');\
        \}\
    \});\
\}\
\
function calculeaza() \{\
    const d = \{\
        ca: parseFloat(document.getElementById('ca').value) || 0,\
        at: parseFloat(document.getElementById('at').value) || 1,\
        ac: parseFloat(document.getElementById('ac').value) || 0,\
        stoc: parseFloat(document.getElementById('stoc').value) || 0,\
        dts: parseFloat(document.getElementById('dts').value) || 1,\
        pn: parseFloat(document.getElementById('pn').value) || 0,\
        cp: parseFloat(document.getElementById('cp').value) || 1,\
        dt: parseFloat(document.getElementById('dt').value) || 1,\
        amort: parseFloat(document.getElementById('amort').value) || 0\
    \};\
\
    // Calcule\
    const lc = (d.ac / d.dts).toFixed(2);\
    const ros = ((d.pn / d.ca) * 100).toFixed(1);\
    \
    // Scor Altman Detaliat\
    const x1 = (d.ac - d.dts) / d.at;\
    const x2 = d.pn / d.at;\
    const x3 = (d.pn * 1.2) / d.at;\
    const x4 = d.cp / d.dt;\
    const x5 = d.ca / d.at;\
    const z = (0.717*x1 + 0.847*x2 + 3.107*x3 + 0.420*x4 + 0.998*x5).toFixed(2);\
\
    // Update UI\
    document.getElementById('val-altman').innerText = z;\
    document.getElementById('val-caf').innerText = (d.pn + d.amort).toLocaleString();\
    \
    // Update Tabel\
    document.getElementById('table-content').innerHTML = `\
        <tr><td>Lichiditate Curent\uc0\u259 </td><td>$\{lc\}</td></tr>\
        <tr><td>Rentabilitate (ROS)</td><td>$\{ros\}%</td></tr>\
        <tr><td>Scor Z (Altman)</td><td>$\{z\}</td></tr>\
    `;\
\
    // Update Pagina Altman cu detalii\
    let status = z > 2.9 ? "Sigur\uc0\u259 " : (z > 1.23 ? "Gri" : "Risc Faliment");\
    document.getElementById('altman-breakdown').innerHTML = `\
        <h3>Rezultat: $\{status\}</h3>\
        <p>Valoarea calculat\uc0\u259  a scorului Z este <strong>$\{z\}</strong>.</p>\
        <ul>\
            <li>X1 (Lichiditate): $\{x1.toFixed(3)\}</li>\
            <li>X4 (Solvabilitate): $\{x4.toFixed(3)\}</li>\
        </ul>\
    `;\
\
    document.getElementById('results').style.display = 'block';\
\
    // Grafic\
    const ctx = document.getElementById('mainChart').getContext('2d');\
    if (myChart) myChart.destroy();\
    myChart = new Chart(ctx, \{\
        type: 'doughnut',\
        data: \{\
            labels: ['Cap. Propriu', 'Datorii'],\
            datasets: [\{\
                data: [d.cp, d.dt],\
                backgroundColor: ['#29b34a', '#ef4444']\
            \}]\
        \},\
        options: \{ plugins: \{ legend: \{ labels: \{ color: '#fff' \} \} \} \}\
    \});\
\}}