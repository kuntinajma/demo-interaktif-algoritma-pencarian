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
    
    // PENTING: Untuk Linear Search, data TIDAK perlu diurutkan.
    currentNimData = [...new Set(parsedData)];

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
function performActualLinearSearch(target) {
    const iterations = 100000;
    let found = false;
    const startTime = performance.now();
    for (let i = 0; i < iterations; i++) {
        for (let j = 0; j < currentNimData.length; j++) {
            if (currentNimData[j] === target) {
                found = true;
                break;
            }
        }
    }
    const endTime = performance.now();
    const totalDuration = endTime - startTime;
    const averageDuration = totalDuration / iterations;
    
    return { found, duration: averageDuration };
}

// Fungsi ini hanya untuk visualisasi langkah-demi-langkah
async function visualizedLinearSearch(target, searchResult) {
    visualizationArea.innerHTML = ''; 
    resultContainer.classList.add('hidden');
    initialMessage.classList.add('hidden');
    
    const checkedIndexes = [];

    for (let i = 0; i < currentNimData.length; i++) {
        const currentValue = currentNimData[i];
        let description = `<b>Langkah ${i + 1}: Periksa Indeks ${i}</b><br>Membandingkan nilai <b>${currentValue}</b> dengan target <b>${target}</b>.`;
        
        // Membuat blok visual baru untuk setiap langkah
        displayLinearStep(currentNimData, i, checkedIndexes, description, i + 1);
        await delay(1500);

        const lastStepElement = visualizationArea.lastChild;

        if (currentValue === target) {
            let foundDescription = `<b>Perbandingan: DITEMUKAN!</b><br>Nilai di indeks <b>${i}</b> (<b>${currentValue}</b>) SAMA DENGAN target.<br>Pencarian berhasil dan berhenti.`;
            const elements = lastStepElement.querySelectorAll('.step-box');
            elements[i].classList.remove('highlight-current');
            elements[i].classList.add('highlight-found');
            lastStepElement.querySelector('p').innerHTML = foundDescription;
            break; 
        } else {
            // Tandai elemen saat ini sebagai sudah diperiksa untuk langkah berikutnya
            checkedIndexes.push(i);
        }
    }

    if (!searchResult.found) {
        let notFoundDescription = `<b>Pencarian Selesai: TIDAK DITEMUKAN</b><br>Seluruh elemen telah diperiksa, dan target <b>${target}</b> tidak ada di dalam daftar.`;
        const finalStepDiv = document.createElement('div');
        finalStepDiv.className = 'mt-4 text-center p-3 bg-red-100 text-red-700 font-semibold rounded-lg border border-red-200';
        finalStepDiv.innerHTML = notFoundDescription;
        visualizationArea.appendChild(finalStepDiv);
    }
    
    // Tampilkan hasil akhir
    if (searchResult.found) {
        showResult(`NIM ${target} Ditemukan!`, 'Absensi berhasil dicatat.', 'success', searchResult.duration);
    } else {
        showResult(`NIM ${target} Tidak Ditemukan`, 'NIM tidak terdaftar dalam sistem. Silakan cek kembali.', 'error', searchResult.duration);
    }
}

// Fungsi utama yang mengorkestrasi semuanya
async function startSearchProcess() {
    if (currentNimData.length === 0) {
        showResult('Gagal', 'Harap atur data NIM terlebih dahulu.', 'error', 0);
        return;
    }
    const target = parseInt(nimInput.value);
    if (isNaN(target)) {
        showResult('Gagal', 'Input NIM yang dicari tidak valid. Harap masukkan angka.', 'error', 0);
        return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = 'Memvisualisasikan...';
    
    const searchResult = performActualLinearSearch(target);
    await visualizedLinearSearch(target, searchResult);

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

// Fungsi BARU untuk membuat blok visual per langkah
function displayLinearStep(array, currentIndex, checkedIndexes, description, stepNumber) {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'p-4 mb-3 bg-white rounded-lg shadow-sm border border-gray-200';
    stepDiv.setAttribute('data-step', stepNumber);

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
        
        if (index === currentIndex) {
            // Elemen yang sedang diperiksa
            elemDiv.classList.add('highlight-current');
        } else if (checkedIndexes.includes(index)) {
            // Elemen yang sudah diperiksa di langkah sebelumnya
            elemDiv.classList.add('highlight-checked');
        } else {
            // Elemen yang belum diperiksa
            elemDiv.classList.add('border-gray-300', 'bg-gray-50');
        }
        
        arrayContainer.appendChild(elemDiv);
    });

    stepDiv.appendChild(arrayContainer);
    visualizationArea.appendChild(stepDiv);
    visualizationArea.scrollTop = visualizationArea.scrollHeight; // Auto-scroll
}


function resetAll() {
    clearTimeout(animationTimeout);
    nimDataInput.value = '210130, 210101, 210120, 210105, 210115, 210107, 210102, 210125, 210104, 210110';
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
window.onload = () => { nimDataInput.value = '210130, 210101, 210120, 210105, 210115, 210107, 210102, 210125, 210104, 210110'; };
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