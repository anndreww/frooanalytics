let myChart = null;

// FUNCȚIA DE NAVIGARE ÎNTRE PAGINI
function showPage(pageId) {
    // Ascunde toate paginile
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    // Arată pagina cerută
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
    }
    
    // Update meniu activ (stil vizual)
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if(item.innerText.toLowerCase().includes(pageId)) {
            item.classList.add('active');
        }
    });
}

// FUNCȚIA DE CALCUL ȘI GENERARE REZULTATE
function calculeaza() {
    // Preluare date din input-uri
    const d = {
        ca: parseFloat(document.getElementById('ca').value) || 0,
        at: parseFloat(document.getElementById('at').value) || 1,
        ac: parseFloat(document.getElementById('ac').value) || 0,
        stoc: parseFloat(document.getElementById('stoc').value) || 0,
        dts: parseFloat(document.getElementById('dts').value) || 1,
        pn: parseFloat(document.getElementById('pn').value) || 0,
        cp: parseFloat(document.getElementById('cp').value) || 1,
        dt: parseFloat(document.getElementById('dt').value) || 1,
        amort: parseFloat(document.getElementById('amort').value) || 0
    };

    // Calcule Indicatori Bază
    const lc = (d.ac / d.dts).toFixed(2);
    const ros = ((d.pn / d.ca) * 100).toFixed(1);
    const caf = d.pn + d.amort;
    
    // Calcul Scor Altman Detaliat (Z-Score)
    const x1 = (d.ac - d.dts) / d.at;
    const x2 = d.pn / d.at;
    const x3 = (d.pn * 1.2) / d.at;
    const x4 = d.cp / d.dt;
    const x5 = d.ca / d.at;
    const z = (0.717*x1 + 0.847*x2 + 3.107*x3 + 0.420*x4 + 0.998*x5).toFixed(2);

    // Update UI - Carduri Sumar
    document.getElementById('val-altman').innerText = z;
    document.getElementById('val-caf').innerText = caf.toLocaleString() + " RON";
    
    // Update Tabel cu noile clase de status (status-ok / status-alert)
    const tableBody = document.getElementById('table-content');
    tableBody.innerHTML = `
        <tr>
            <td>Lichiditate Curentă</td>
            <td>${lc}</td>
            <td><span class="${lc > 1.5 ? 'status-ok' : 'status-alert'}">${lc > 1.5 ? 'Optim' : 'Atenție'}</span></td>
        </tr>
        <tr>
            <td>Rentabilitate (ROS)</td>
            <td>${ros}%</td>
            <td><span class="status-ok">Eficiență</span></td>
        </tr>
        <tr>
            <td>Scor Z (Altman)</td>
            <td>${z}</td>
            <td><span class="${z > 2.9 ? 'status-ok' : 'status-alert'}">${z > 2.9 ? 'Sigur' : 'Risc'}</span></td>
        </tr>
    `;

    // Update Pagina Secundară (Altman Breakdown)
    let status = z > 2.9 ? "Zonă Sigură" : (z > 1.23 ? "Zonă Gri" : "Risc Faliment");
    const altmanSection = document.getElementById('altman-breakdown');
    if (altmanSection) {
        altmanSection.innerHTML = `
            <h3 style="color: var(--primary)">Rezultat Analiză: ${status}</h3>
            <p>Valoarea calculată a scorului Z pentru Froo România este <strong>${z}</strong>.</p>
            <ul style="list-style: none; padding: 0;">
                <li><strong>X1 (Lichiditate):</strong> ${x1.toFixed(3)}</li>
                <li><strong>X2 (Profitabilitate):</strong> ${x2.toFixed(3)}</li>
                <li><strong>X3 (Productivitate Active):</strong> ${x3.toFixed(3)}</li>
                <li><strong>X4 (Solvabilitate):</strong> ${x4.toFixed(3)}</li>
                <li><strong>X5 (Rotație):</strong> ${x5.toFixed(3)}</li>
            </ul>
        `;
    }

    // Afișează secțiunea de rezultate
    document.getElementById('results').style.display = 'block';

    // Generare/Update Grafic (Chart.js)
    const ctx = document.getElementById('mainChart').getContext('2d');
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Cap. Propriu', 'Datorii'],
            datasets: [{
                data: [d.cp, d.dt],
                backgroundColor: ['#29b34a', '#ef4444'],
                hoverOffset: 4,
                borderWidth: 0
            }]
        },
        options: { 
            plugins: { 
                legend: { 
                    position: 'bottom',
                    labels: { color: '#fff', padding: 20 } 
                } 
            } 
        }
    });
}
