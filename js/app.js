// Navegação Fluida
function nav(id, el) {
    document.querySelectorAll('.section-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    el.classList.add('active');
}

// Checklist Rápido
function checkTasks() {
    if(document.getElementById('t1').checked && document.getElementById('t2').checked && document.getElementById('t3').checked) {
        document.getElementById('alertaTask').classList.remove('d-none');
    }
}

// --- Solução 1: FEFO, Validade e Desperdício ---
let totalRisco = 340.00;

function atualizarDisplaysRisco() {
    let valorFormatado = `R$ ${Math.max(0, totalRisco).toFixed(2).replace('.', ',')}`;
    document.getElementById('totalRiscoBadge').innerText = `Total em Risco: ${valorFormatado}`;
    document.getElementById('dash-total-risco').innerText = valorFormatado;
    
    let badge = document.getElementById('totalRiscoBadge');
    if(totalRisco <= 0) {
        badge.className = "badge bg-success fs-6 p-2";
    } else {
        badge.className = "badge bg-danger fs-6 p-2";
    }
}

function resolverProblema(id, msg, valor) {
    let linha = document.getElementById(id);
    linha.style.opacity = "0";
    setTimeout(() => {
        linha.remove();
        totalRisco -= valor;
        atualizarDisplaysRisco();
        
        let alerta = document.getElementById('alertaValidade');
        alerta.innerHTML = `<strong>Resolvido:</strong> ${msg}`;
        alerta.classList.remove('d-none');
        setTimeout(() => alerta.classList.add('d-none'), 3000);
    }, 300);
}

function lancarDesperdicio() {
    let item = prompt("Qual produto deseja lançar? (Ex: Fornada de Pão Queimada, Queijo Próximo ao Vencimento)");
    if (!item) return;
    
    let valorStr = prompt("Qual o valor estimado deste item? (Ex: 45.50)");
    if (!valorStr) return;
    
    let valor = parseFloat(valorStr.replace(',', '.'));
    if (isNaN(valor)) return alert("Por favor, insira um número válido.");

    // Novos dados solicitados
    let vencimento = prompt("Qual a data de vencimento? (Ex: 20/10/2026, Vence Amanhã)");
    if (!vencimento) vencimento = "Não informada";

    let status = prompt("Qual o status atual? (Ex: Em Risco, Estragado, Quebrado)");
    if (!status) status = "Registrado";

    totalRisco += valor;
    atualizarDisplaysRisco();

    let idNovaLinha = 'desp-' + Date.now();
    
    // Adiciona a linha na tabela com as informações novas e os botões exigidos
    document.querySelector('#tabelaValidade tbody').innerHTML += `
        <tr id="${idNovaLinha}">
            <td><strong>${item}</strong></td>
            <td class="text-danger fw-bold">R$ ${valor.toFixed(2).replace('.', ',')}</td>
            <td><span class="badge bg-secondary">${vencimento} - ${status}</span></td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning text-dark mb-1 w-100" onclick="resolverProblema('${idNovaLinha}', 'Transferido para produção!', ${valor})">Transferir p/ Produção</button>
                <button class="btn btn-sm btn-success mb-1 w-100" onclick="resolverProblema('${idNovaLinha}', 'Criado combo promocional!', ${valor})">Criar Promoção</button>
            </td>
        </tr>
    `;
}

// --- Solução 2: KDS Cozinha ---
function moverKDS(id, dest) {
    let ped = document.getElementById(id);
    ped.classList.remove('delayed');
    
    ped.style.borderLeftColor = dest === 'kds-preparo' ? "#ffc107" : "#198754";
    let btn = ped.querySelector('button');
    
    if(dest === 'kds-preparo') {
        btn.innerHTML = 'Marcar Pronto'; 
        btn.className = 'btn btn-sm btn-success w-100';
        btn.setAttribute('onclick', `moverKDS('${id}', 'kds-pronto')`);
    } else {
        btn.innerHTML = 'Entregar'; 
        btn.className = 'btn btn-sm btn-outline-secondary w-100';
        btn.setAttribute('onclick', `document.getElementById('${id}').remove()`);
    }
    document.getElementById(dest).appendChild(ped);
}

// --- Solução 3: IA de Demanda ---
function atualizarIA() {
    let c = document.getElementById('simuladorClima').value;
    let t = document.getElementById('ia-texto');
    let l = document.getElementById('ia-lista');
    if(c === 'frio') {
        t.innerText = "Frio detectado. Foco em produtos quentes.";
        l.innerHTML = `<li class="list-group-item">Sopas e Caldos <span class="badge bg-success">+80% (Produzir)</span></li>`;
    } else if(c === 'sol') {
        t.innerText = "Calor detectado. Reduzir forno.";
        l.innerHTML = `<li class="list-group-item">Bebidas Geladas <span class="badge bg-success">+50% (Aumentar)</span></li><li class="list-group-item">Bolos Pesados <span class="badge bg-danger">-30% (Pausar)</span></li>`;
    } else {
        t.innerText = "Aguardando cenário..."; l.innerHTML = "";
    }
}

// --- Solução 4: Fichas e Custos ---
function calcularPreco() {
    let custo = parseFloat(document.getElementById('custo-base').innerText);
    let margem = parseFloat(document.getElementById('input-markup').value) || 0;
    document.getElementById('preco-final').innerText = `R$ ${(custo + (custo * (margem/100))).toFixed(2).replace('.', ',')}`;
}

// --- Solução 5: PDV Caixa Integrado ---
let total = 0;
let itensComandaAtual = [];
let numeroMesa = 13;

function addPDV(nome, preco) {
    document.getElementById('lista-comanda').innerHTML += `<div class="d-flex justify-content-between border-bottom pb-1 mb-1"><small>1x ${nome}</small><small>R$ ${preco.toFixed(2)}</small></div>`;
    total += preco;
    itensComandaAtual.push(nome);
    document.getElementById('total-pdv').innerText = total.toFixed(2);
}

function finalizarCompra() {
    if(total === 0) return alert("Comanda vazia! Adicione itens primeiro.");
    
    let idPedido = 'pedido-mesa' + numeroMesa;
    let listaHtml = itensComandaAtual.map(item => `<li>1x ${item}</li>`).join('');
    
    let novoCard = document.createElement('div');
    novoCard.className = 'kds-card';
    novoCard.id = idPedido;
    novoCard.innerHTML = `
        <h5 class="fw-bold text-dark">MESA ${numeroMesa} <span class="badge bg-primary float-end fs-6">Novo</span></h5>
        <ul>${listaHtml}</ul>
        <button class="btn btn-sm btn-dark w-100" onclick="moverKDS('${idPedido}', 'kds-preparo')">Iniciar Preparo</button>
    `;
    
    document.getElementById('kds-fila').appendChild(novoCard);

    alert(`Pagamento confirmado! Pedido da Mesa ${numeroMesa} enviado automaticamente para o painel da Cozinha.`);
    
    document.getElementById('lista-comanda').innerHTML = "";
    total = 0; 
    document.getElementById('total-pdv').innerText = "0.00";
    itensComandaAtual = [];
    numeroMesa++;
}