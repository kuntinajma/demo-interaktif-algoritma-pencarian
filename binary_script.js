// --- Data dan Elemen DOM ---
let currentNimData = [];

const nimDataInput = document.getElementById('nim-data-input');
const setDataBtn = document.getElementById('set-data-btn');
const sortedDataDisplay = document.getElementById('sorted-data-display');

const nimInput = document.getElementById('nim-input');
const searchBtn = document.getElementById('search-btn');
const resetBtn = document.getElementById('reset-btn');
const visualizationArea = document.getElementById('visualization-area');
const initialMessage = document.getElementById('initial-message');
const resultContainer = document.getElementById('result-container');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const resultRuntime = document.getElementById('result-runtime');

let animationTimeout;

// --- Fungsi Pengaturan Data ---
function setupNimData() {
    const rawData = nimDataInput.value;
    if (!rawData.trim()) {
        alert("Kolom data NIM tidak boleh kosong.");
        return;
    }
    const parsedData = rawData.split(',')
                            .map(item => item.trim())
                            .filter(item => !isNaN(parseInt(item)) && item)
                            .map(item => parseInt(item));
    currentNimData = [...new Set(parsedData)].sort((a, b) => a - b);
    if (currentNimData.length === 0) {
        sortedDataDisplay.innerHTML = `<span class="text-red-500 italic">Data tidak valid. Masukkan angka yang dipisah koma.</span>`;
        return;
    }
    sortedDataDisplay.textContent = `[${currentNimData.join(', ')}]`;
    sortedDataDisplay.classList.remove('text-gray-500', 'italic');
    visualizationArea.innerHTML = '';
    initialMessage.classList.remove('hidden');
    initialMessage.textContent = "Data berhasil diatur. Silakan masukkan NIM yang akan dicari.";
    resultContainer.classList.add('hidden');
}

// --- Logika Pencarian ---

// Fungsi ini menjalankan algoritma murni untuk mengukur waktu rata-rata
function performActualBinarySearch(target) {
    const iterations = 100000; // Jalankan 100.000 kali untuk pengukuran yang stabil
    let found = false;

    const startTime = performance.now();
    for (let i = 0; i < iterations; i++) {
        let low = 0;
        let high = currentNimData.length - 1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            const midValue = currentNimData[mid];
            if (midValue === target) {
                found = true;
                break;
            } else if (midValue < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
    }
    const endTime = performance.now();
    const totalDuration = endTime - startTime;
    const averageDuration = totalDuration / iterations; // Hitung waktu rata-rata
    
    return { found, duration: averageDuration };
}

// Fungsi ini hanya untuk visualisasi langkah-demi-langkah
async function visualizedBinarySearch(target, searchResult) {
    visualizationArea.innerHTML = ''; 
    resultContainer.classList.add('hidden');
    initialMessage.classList.add('hidden');
    
    let low = 0;
    let high = currentNimData.length - 1;
    let step = 1;
    
    let initialDescription = `<b>Mulai Pencarian:</b> Mencari NIM <b>${target}</b>. Batas awal [${low}, ${high}].`;
    displayArrayState(currentNimData, low, high, -1, initialDescription, step);
    await delay(2500);

    while (low <= high) {
        step++;
        let mid = Math.floor((low + high) / 2);
        const midValue = currentNimData[mid];
        
        let midDescription = `<b>Langkah ${step}: Hitung Titik Tengah (mid)</b><br>Batas: [${low}, ${high}]. Rumus: floor((${low} + ${high}) / 2) = <b>${mid}</b>.<br>Nilai di indeks tengah adalah <b>${midValue}</b>.`;
        displayArrayState(currentNimData, low, high, mid, midDescription, step);
        await delay(3000);

        const currentStepElement = visualizationArea.querySelector(`[data-step="${step}"]`);
        
        if (midValue === target) {
            let foundDescription = `<b>Perbandingan: DITEMUKAN!</b><br>Nilai tengah (<b>${midValue}</b>) SAMA DENGAN target (<b>${target}</b>).<br>Pencarian berhasil dan berhenti.`;
            updateStepDescription(currentStepElement, foundDescription);
            highlightFinalState(low, high, mid, true);
            break; 
        } else if (midValue < target) {
            let newLow = mid + 1;
            let discardDescription = `<b>Perbandingan: Nilai Tengah < Target</b><br>Nilai tengah (<b>${midValue}</b>) < target (<b>${target}</b>). Abaikan bagian kiri.<br>Batas bawah (low) baru: low = mid + 1 = ${mid} + 1 = <b>${newLow}</b>.`;
            updateStepDescription(currentStepElement, discardDescription);
            highlightDiscarded(low, mid);
            low = newLow;
        } else {
            let newHigh = mid - 1;
            let discardDescription = `<b>Perbandingan: Nilai Tengah > Target</b><br>Nilai tengah (<b>${midValue}</b>) > target (<b>${target}</b>). Abaikan bagian kanan.<br>Batas atas (high) baru: high = mid - 1 = ${mid} - 1 = <b>${newHigh}</b>.`;
            updateStepDescription(currentStepElement, discardDescription);
            highlightDiscarded(mid, high);
            high = newHigh;
        }
        await delay(3500);
    }

    if (!searchResult.found) {
        let notFoundDescription = `<b>Pencarian Selesai: TIDAK DITEMUKAN</b><br>Batas bawah (low=${low}) telah melewati batas atas (high=${high}).<br>Target <b>${target}</b> tidak ada di dalam daftar.`;
        const finalStepDiv = document.createElement('div');
        finalStepDiv.className = 'mt-4 text-center p-3 bg-red-100 text-red-700 font-semibold rounded-lg border border-red-200';
        finalStepDiv.innerHTML = notFoundDescription;
        visualizationArea.appendChild(finalStepDiv);
    }

    // Tampilkan hasil akhir setelah visualisasi selesai
    if (searchResult.found) {
        showResult(`NIM ${target} Ditemukan!`, 'Absensi berhasil dicatat.', 'success', searchResult.duration);
    } else {
        showResult(`NIM ${target} Tidak Ditemukan`, 'NIM tidak terdaftar dalam sistem. Silakan cek kembali.', 'error', searchResult.duration);
    }
}

// Fungsi utama yang mengorkestrasi semuanya
async function startSearchProcess() {
    if (currentNimData.length === 0) {
        showResult('Gagal', 'Harap atur dan urutkan data NIM terlebih dahulu.', 'error', 0);
        return;
    }
    const target = parseInt(nimInput.value);
    if (isNaN(target)) {
        showResult('Gagal', 'Input NIM yang dicari tidak valid. Harap masukkan angka.', 'error', 0);
        return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = 'Memvisualisasikan...';

    // 1. Jalankan pencarian murni untuk dapatkan waktu eksekusi rata-rata
    const searchResult = performActualBinarySearch(target);

    // 2. Jalankan visualisasi dengan hasil yang sudah diketahui
    await visualizedBinarySearch(target, searchResult);

    searchBtn.disabled = false;
    searchBtn.textContent = 'Cari & Catat Absensi';
}


// --- Fungsi Helper untuk UI & Visualisasi ---
function delay(ms) {
    return new Promise(resolve => {
        animationTimeout = setTimeout(resolve, ms);
    });
}

function showResult(title, message, type, duration) {
    resultTitle.textContent = title;
    resultMessage.textContent = message;
    
    // Konversi milidetik ke mikrodetik untuk detail lebih baik
    const durationInMicroseconds = duration * 1000;
    resultRuntime.textContent = `Waktu eksekusi rata-rata: ${durationInMicroseconds.toFixed(3)} µs (dari 100,000 iterasi).`;
    
    resultContainer.classList.remove('hidden');
    resultContainer.className = 'mt-6 p-5 rounded-lg border shadow-sm text-center';
    if (type === 'success') {
        resultContainer.classList.add('bg-green-100', 'border-green-300');
        resultTitle.classList.add('text-green-800');
    } else {
        resultContainer.classList.add('bg-red-100', 'border-red-300');
        resultTitle.classList.add('text-red-800');
    }
}

function displayArrayState(array, low, high, mid, description, step) {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'p-4 mb-3 bg-white rounded-lg shadow-sm border border-gray-200';
    stepDiv.setAttribute('data-step', step);
    const descriptionP = document.createElement('p');
    descriptionP.className = 'text-sm text-gray-700 mb-4';
    descriptionP.innerHTML = description;
    stepDiv.appendChild(descriptionP);
    const arrayContainer = document.createElement('div');
    arrayContainer.className = 'flex flex-wrap gap-2 justify-center';
    array.forEach((value, index) => {
        const elemDiv = document.createElement('div');
        elemDiv.className = 'step-box w-20 h-10 flex items-center justify-center rounded-md font-semibold text-xs md:text-sm transition-all duration-300 border-2';
        elemDiv.textContent = value;
        if (index >= low && index <= high) {
            elemDiv.classList.add('bg-blue-100', 'text-blue-800', 'border-blue-300');
        } else {
            elemDiv.classList.add('bg-gray-200', 'text-gray-500', 'border-gray-300', 'opacity-60');
        }
        if (index === mid) {
            elemDiv.classList.add('highlight-mid');
        }
        arrayContainer.appendChild(elemDiv);
    });
    stepDiv.appendChild(arrayContainer);
    visualizationArea.appendChild(stepDiv);
    visualizationArea.scrollTop = visualizationArea.scrollHeight;
}

function highlightDiscarded(start, end) {
    const latestStep = visualizationArea.lastChild;
    if (!latestStep) return;
    const elements = latestStep.querySelectorAll('.step-box');
    for (let i = start; i <= end; i++) {
        if (elements[i]) {
            elements[i].classList.add('highlight-discard');
        }
    }
}

function updateStepDescription(stepElement, newText) {
     if (!stepElement) return;
     const descriptionP = stepElement.querySelector('p');
     if(descriptionP) {
         descriptionP.innerHTML = newText;
     }
}

function highlightFinalState(low, high, mid, found) {
    const latestStep = visualizationArea.lastChild;
    if (!latestStep) return;
    const elements = latestStep.querySelectorAll('.step-box');
    elements.forEach((el, index) => {
        if (index === mid && found) {
            el.classList.remove('highlight-mid');
            el.classList.add('highlight-found');
        }
    });
}

function resetAll() {
    clearTimeout(animationTimeout);
    nimDataInput.value = '210101, 210102, 210104, 210105, 210107, 210110, 210115, 210120, 210125, 210130';
    currentNimData = [];
    sortedDataDisplay.innerHTML = `<p class="break-words text-gray-500 italic">Data akan ditampilkan di sini setelah diatur.</p>`;
    nimInput.value = '';
    visualizationArea.innerHTML = '';
    initialMessage.classList.remove('hidden');
    initialMessage.textContent = "Atur data NIM terlebih dahulu, lalu masukkan NIM yang dicari dan klik 'Cari'.";
    resultContainer.classList.add('hidden');
    searchBtn.disabled = false;
    searchBtn.textContent = 'Cari & Catat Absensi';
}

// --- Event Listeners ---
window.onload = () => { nimDataInput.value = '210101, 210102, 210104, 210105, 210107, 210110, 210115, 210120, 210125, 210130'; };
setDataBtn.addEventListener('click', setupNimData);
searchBtn.addEventListener('click', startSearchProcess);
resetBtn.addEventListener('click', resetAll);
nimInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if(!searchBtn.disabled) {
            startSearchProcess();
        }
    }
});