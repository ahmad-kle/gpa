// بيانات التطبيق
let courses = [];
let currentLang = 'ar';
let selectedCollegeHours = 171;

// قاموس الرموز والنقاط
const gradePoints = {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'F': 0.0
};

// الترجمة
const translations = {
    ar: {
        college_title: 'اختر كليتك',
        total_hours_label: 'إجمالي ساعات التخرج:',
        previous_title: 'البيانات السابقة',
        completed_hours: 'الساعات المنجزة سابقاً:',
        old_gpa: 'المعدل التراكمي القديم (من 4):',
        courses_title: 'مواد الفصل الحالي',
        add_course: 'إضافة مادة',
        ocr_title: 'رفع صورة العلامات',
        upload_text: 'اضغط أو اسحب صورة العلامات هنا',
        ocr_note: '*سيتم استخراج النصوص تجريبياً (يمكن تعديلها)',
        calculate: 'احسب المعدل',
        reset: 'إعادة تعيين',
        results_title: 'النتائج',
        semester_gpa: 'المعدل الفصلي:',
        cumulative_gpa: 'المعدل التراكمي:',
        total_hours: 'إجمالي الساعات:',
        progress_label: 'نسبة الإنجاز:'
    },
    en: {
        college_title: 'Select Your College',
        total_hours_label: 'Total Graduation Hours:',
        previous_title: 'Previous Records',
        completed_hours: 'Completed Hours:',
        old_gpa: 'Previous Cumulative GPA (out of 4):',
        courses_title: 'Current Semester Courses',
        add_course: 'Add Course',
        ocr_title: 'Upload Grades Image',
        upload_text: 'Click or drag an image here',
        ocr_note: '*Text will be extracted experimentally (editable)',
        calculate: 'Calculate GPA',
        reset: 'Reset',
        results_title: 'Results',
        semester_gpa: 'Semester GPA:',
        cumulative_gpa: 'Cumulative GPA:',
        total_hours: 'Total Hours:',
        progress_label: 'Completion Progress:'
    }
};

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // شاشة الترحيب
    setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        const main = document.getElementById('mainContent');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            main.classList.remove('hidden');
        }, 500);
    }, 3000);

    // إضافة مادة افتراضية
    addCourse();
    
    // الأحداث
    document.getElementById('addCourseBtn').addEventListener('click', () => addCourse());
    document.getElementById('calculateBtn').addEventListener('click', () => calculateGPA());
    document.getElementById('resetBtn').addEventListener('click', () => resetAll());
    
    // اختيار الكلية
    document.querySelectorAll('.college-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.college-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedCollegeHours = parseInt(this.dataset.hours);
            document.getElementById('totalGraduationHours').value = selectedCollegeHours;
            calculateGPA();
        });
    });
    
    document.getElementById('totalGraduationHours').addEventListener('input', (e) => {
        selectedCollegeHours = parseInt(e.target.value) || 171;
        calculateGPA();
    });
    
    // رفع الصورة OCR
    const uploadArea = document.getElementById('uploadArea');
    const ocrInput = document.getElementById('ocrImageInput');
    
    uploadArea.addEventListener('click', () => ocrInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#eef2ff';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '#f8f9ff';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#f8f9ff';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            processOCRImage(file);
        }
    });
    
    ocrInput.addEventListener('change', (e) => {
        if (e.target.files[0]) processOCRImage(e.target.files[0]);
    });
    
    // تبديل اللغة
    document.getElementById('langAr').addEventListener('click', () => switchLanguage('ar'));
    document.getElementById('LangEn').addEventListener('click', () => switchLanguage('en'));
    
    // تحديث المدخلات
    document.getElementById('completedHours').addEventListener('input', () => calculateGPA());
    document.getElementById('oldGpa').addEventListener('input', () => calculateGPA());
    
    // حساب أولي
    calculateGPA();
});

// إضافة مادة جديدة
function addCourse(grade = 'A', hours = 3) {
    const container = document.getElementById('coursesContainer');
    const courseId = Date.now();
    
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course-item';
    courseDiv.dataset.id = courseId;
    
    courseDiv.innerHTML = `
        <div class="course-grade">
            <select class="grade-select">
                ${Object.keys(gradePoints).map(g => `<option value="${g}" ${g === grade ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
        </div>
        <div class="course-hours">
            <input type="number" class="hours-input" value="${hours}" min="1" max="6" step="1">
        </div>
        <button class="delete-course"><i class="fas fa-trash"></i></button>
    `;
    
    courseDiv.querySelector('.delete-course').addEventListener('click', () => {
        courseDiv.remove();
        calculateGPA();
    });
    
    courseDiv.querySelector('.grade-select').addEventListener('change', () => calculateGPA());
    courseDiv.querySelector('.hours-input').addEventListener('input', () => calculateGPA());
    
    container.appendChild(courseDiv);
    calculateGPA();
}

// حساب المعدل
function calculateGPA() {
    // حساب المعدل الفصلي
    let totalPoints = 0;
    let totalHours = 0;
    
    document.querySelectorAll('.course-item').forEach(course => {
        const grade = course.querySelector('.grade-select').value;
        const hours = parseFloat(course.querySelector('.hours-input').value) || 0;
        const points = gradePoints[grade] || 0;
        
        totalPoints += points * hours;
        totalHours += hours;
    });
    
    const semesterGpa = totalHours > 0 ? totalPoints / totalHours : 0;
    
    // حساب المعدل التراكمي
    const completedHours = parseFloat(document.getElementById('completedHours').value) || 0;
    const oldGpa = parseFloat(document.getElementById('oldGpa').value) || 0;
    const oldTotalPoints = oldGpa * completedHours;
    const newTotalPoints = oldTotalPoints + totalPoints;
    const totalAllHours = completedHours + totalHours;
    const cumulativeGpa = totalAllHours > 0 ? newTotalPoints / totalAllHours : 0;
    
    // عرض النتائج
    document.getElementById('semesterGpa').textContent = semesterGpa.toFixed(2);
    document.getElementById('cumulativeGpa').textContent = cumulativeGpa.toFixed(2);
    document.getElementById('totalHours').textContent = totalAllHours;
    
    // نسبة الإنجاز
    const progressPercent = Math.min(100, (totalAllHours / selectedCollegeHours) * 100);
    document.getElementById('progressFill').style.width = `${progressPercent}%`;
    document.getElementById('progressPercent').textContent = `${progressPercent.toFixed(1)}%`;
}

// إعادة تعيين
function resetAll() {
    document.getElementById('completedHours').value = 0;
    document.getElementById('oldGpa').value = 0;
    document.getElementById('totalGraduationHours').value = selectedCollegeHours;
    document.querySelectorAll('.college-option').forEach(opt => opt.classList.remove('active'));
    document.getElementById('coursesContainer').innerHTML = '';
    addCourse();
}

// معالجة صورة OCR (تجريبي)
function processOCRImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const resultDiv = document.getElementById('ocrResult');
        const textsDiv = document.getElementById('ocrTexts');
        
        // محاكاة OCR (في الواقع تحتاج لمكتبة مثل Tesseract.js)
        textsDiv.innerHTML = `
            <p>📄 تم استخراج النصوص التالية تجريبياً:</p>
            <ul>
                <li>مادة 1: A, 3 ساعات</li>
                <li>مادة 2: B+, 2 ساعات</li>
                <li>مادة 3: A-, 4 ساعات</li>
            </ul>
            <p>💡 يمكنك إدخال المواد يدوياً من الأعلى</p>
            <button onclick="autoFillDemo()" class="btn-secondary" style="margin-top:10px;padding:8px 20px;">
                <i class="fas fa-magic"></i> تعبئة تجريبية
            </button>
        `;
        resultDiv.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

// تعبئة تجريبية أوتوماتيكية
function autoFillDemo() {
    document.getElementById('coursesContainer').innerHTML = '';
    addCourse('A', 3);
    addCourse('B+', 2);
    addCourse('A-', 4);
    calculateGPA();
}

// تبديل اللغة
function switchLanguage(lang) {
    currentLang = lang;
    document.getElementById('langAr').classList.toggle('active', lang === 'ar');
    document.getElementById('LangEn').classList.toggle('active', lang === 'en');
    document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        if (translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });
}

// جعل autoFillDemo عامة
window.autoFillDemo = autoFillDemo;