// ======================== المتغيرات العامة ========================
let currentLang = 'ar';
let selectedCollegeHours = 171; // سيتم تحديثها من اختيار الكلية
let currentMode = 'gpa'; // 'gpa' or 'percent'

// جدول تحويل الدرجات المئوية إلى GPA حسب نظام الجامعة
// المصدر: الجدول الذي أرسله المستخدم
const gradeMapping = [
    { minPercent: 99, maxPercent: 100, grade: 'A+', points: 4.0, arabicEval: 'ممتاز', englishEval: 'Excellent' },
    { minPercent: 95, maxPercent: 98.99, grade: 'A', points: 3.75, arabicEval: 'ممتاز', englishEval: 'Excellent' },
    { minPercent: 90, maxPercent: 94.99, grade: 'A-', points: 3.5, arabicEval: 'ممتاز', englishEval: 'Excellent' },
    { minPercent: 85, maxPercent: 89.99, grade: 'B+', points: 3.25, arabicEval: 'جيد جداً', englishEval: 'Very Good' },
    { minPercent: 80, maxPercent: 84.99, grade: 'B', points: 3.0, arabicEval: 'جيد جداً', englishEval: 'Very Good' },
    { minPercent: 75, maxPercent: 79.99, grade: 'B-', points: 2.75, arabicEval: 'جيد', englishEval: 'Good' },
    { minPercent: 70, maxPercent: 74.99, grade: 'C+', points: 2.5, arabicEval: 'جيد', englishEval: 'Good' },
    { minPercent: 65, maxPercent: 69.99, grade: 'C', points: 2.25, arabicEval: 'مقبول', englishEval: 'Acceptable' },
    { minPercent: 60, maxPercent: 64.99, grade: 'C-', points: 2.0, arabicEval: 'مقبول', englishEval: 'Acceptable' },
    { minPercent: 55, maxPercent: 59.99, grade: 'D+', points: 1.75, arabicEval: 'ضعيف', englishEval: 'Weak' },
    { minPercent: 50, maxPercent: 54.99, grade: 'D', points: 1.5, arabicEval: 'ضعيف', englishEval: 'Weak' },
    { minPercent: 0, maxPercent: 49.99, grade: 'F', points: 0.0, arabicEval: 'راسب', englishEval: 'Fail' }
];

// بناء كائن gradePoints من الجدول (لتسهيل الوصول)
const gradePoints = {};
gradeMapping.forEach(item => {
    gradePoints[item.grade] = item.points;
});

// دالة للحصول على رمز المادة من الدرجة المئوية (للاستخدام المستقبلي)
function getGradeFromPercent(percent) {
    for (let i = 0; i < gradeMapping.length; i++) {
        if (percent >= gradeMapping[i].minPercent && percent <= gradeMapping[i].maxPercent) {
            return gradeMapping[i].grade;
        }
    }
    return 'F';
}

// دالة للحصول على التقييم النصي من الدرجة المئوية
function getEvaluationFromPercent(percent, lang) {
    for (let i = 0; i < gradeMapping.length; i++) {
        if (percent >= gradeMapping[i].minPercent && percent <= gradeMapping[i].maxPercent) {
            return lang === 'ar' ? gradeMapping[i].arabicEval : gradeMapping[i].englishEval;
        }
    }
    return lang === 'ar' ? 'راسب' : 'Fail';
}

// دالة لتحويل GPA إلى نسبة مئوية (بحسب الجدول العكسي)
// نبحث عن أقرب نقطة GPA في الجدول، ونعيد متوسط الدرجة المئوية أو استخدام الاستيفاء البسيط.
function gpaToPercent(gpa) {
    if (gpa >= 4.0) return 100;
    if (gpa <= 0) return 0;
    // نجد الفترة التي ينتمي إليها الـ GPA
    for (let i = 0; i < gradeMapping.length - 1; i++) {
        let upper = gradeMapping[i];
        let lower = gradeMapping[i+1];
        if (gpa <= upper.points && gpa >= lower.points) {
            // GPA بين نقطتين معروفتين
            let ratio = (gpa - lower.points) / (upper.points - lower.points);
            let percentStart = lower.minPercent;
            let percentEnd = upper.maxPercent;
            // نأخذ متوسط النطاق أو استيفاء خطي
            return percentStart + ratio * (percentEnd - percentStart);
        }
    }
    // إذا لم نجد (مثلاً GPA بين 3.75 و4) يتم التعامل معه
    if (gpa > gradeMapping[0].points) return 100;
    return 0;
}

// دالة للحصول على التقييم النصي من GPA (حسب النظام المئوي المحول)
function getGpaEvaluation(gpa, lang) {
    let percent = gpaToPercent(gpa);
    return getEvaluationFromPercent(percent, lang);
}

// دوال مساعدة أخرى (تقييم قديم للنظام، يمكن الاحتفاظ بها للتوافق)
function getGpaEvaluationOld(gpa) { // للاستخدام في حال عدم التبديل
    let percent = gpaToPercent(gpa);
    return getEvaluationFromPercent(percent, currentLang);
}

// تحديث واجهة النتائج
function updateEnhancedResults(semesterGpa, cumulativeGpa, totalPassedHours, collegeType, totalGradHours) {
    const isPercent = (currentMode === 'percent');
    let semesterDisplay, cumulativeDisplay, semesterEvalText, cumulativeEvalText;
    if (isPercent) {
        semesterDisplay = gpaToPercent(semesterGpa).toFixed(1);
        cumulativeDisplay = gpaToPercent(cumulativeGpa).toFixed(1);
        semesterEvalText = getGpaEvaluation(semesterGpa, currentLang);
        cumulativeEvalText = getGpaEvaluation(cumulativeGpa, currentLang);
        document.getElementById('semesterUnitLabel').innerHTML = '%';
        document.getElementById('cumulativeUnitLabel').innerHTML = '%';
    } else {
        semesterDisplay = semesterGpa.toFixed(2);
        cumulativeDisplay = cumulativeGpa.toFixed(2);
        semesterEvalText = getGpaEvaluation(semesterGpa, currentLang);
        cumulativeEvalText = getGpaEvaluation(cumulativeGpa, currentLang);
        document.getElementById('semesterUnitLabel').innerHTML = '/4.00';
        document.getElementById('cumulativeUnitLabel').innerHTML = '/4.00';
    }
    document.getElementById('semesterGpaValue').innerHTML = semesterDisplay;
    document.getElementById('cumulativeGpaValue').innerHTML = cumulativeDisplay;
    document.getElementById('semesterEval').innerHTML = semesterEvalText;
    document.getElementById('cumulativeEval').innerHTML = cumulativeEvalText;
    document.getElementById('totalHoursValue').innerHTML = totalPassedHours;
    
    // حساب السنة والمتبقي
    const yearInfo = getAcademicYearInfo(totalPassedHours, collegeType, totalGradHours);
    let yearName = '';
    if (collegeType === 'engineering') {
        const years = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'];
        yearName = currentLang === 'ar' ? years[yearInfo.year-1] : `Year ${yearInfo.year}`;
    } else if (collegeType === 'management') {
        const years = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة'];
        yearName = currentLang === 'ar' ? years[yearInfo.year-1] : `Year ${yearInfo.year}`;
    } else if (collegeType === 'medicine') {
        const years = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة'];
        yearName = currentLang === 'ar' ? years[yearInfo.year-1] : `Year ${yearInfo.year}`;
    }
    document.getElementById('currentYearValue').innerHTML = yearName;
    document.getElementById('remainingToGraduate').innerHTML = yearInfo.remainingToGraduate;
    if ((collegeType === 'engineering' && yearInfo.year === 5) ||
        (collegeType === 'management' && yearInfo.year === 4) ||
        (collegeType === 'medicine' && yearInfo.year === 6) ||
        totalPassedHours >= totalGradHours) {
        document.getElementById('remainingToNextYear').innerHTML = '—';
    } else {
        document.getElementById('remainingToNextYear').innerHTML = yearInfo.remainingToNextYear;
    }
    const gradPercent = Math.min(100, (totalPassedHours / totalGradHours) * 100);
    document.getElementById('graduationProgressFill').style.width = `${gradPercent}%`;
    document.getElementById('graduationPercent').innerHTML = gradPercent.toFixed(1);
}

// دوال حساب السنة (نفس السابق)
function getAcademicYearInfo(totalHours, collegeType, totalGradHours) {
    let thresholds = [];
    if (collegeType === 'engineering') thresholds = [23, 51, 82, 114, totalGradHours];
    else if (collegeType === 'management') thresholds = [23, 51, 82, totalGradHours];
    else thresholds = [30, 65, 100, 135, 170, totalGradHours];
    let year = 1;
    let nextThreshold = thresholds[0];
    for (let i = 0; i < thresholds.length; i++) {
        if (totalHours < thresholds[i]) {
            nextThreshold = thresholds[i];
            break;
        }
        year = i + 2;
        nextThreshold = thresholds[i+1];
        if (i+1 >= thresholds.length) nextThreshold = totalGradHours;
    }
    if (totalHours >= totalGradHours) year = thresholds.length;
    const remainingToNextYear = Math.max(0, nextThreshold - totalHours);
    const remainingToGraduate = Math.max(0, totalGradHours - totalHours);
    return { year, remainingToNextYear, remainingToGraduate };
}

// حساب المعدل
function calculateGPA() {
    const activeCollege = document.querySelector('.college-option.active');
    let collegeType = activeCollege?.dataset.type || 'engineering';
    let totalGradHours = parseFloat(document.getElementById('totalGraduationHours').value) || 171;
    
    let totalPoints = 0, totalHoursForGPA = 0, totalSuccessHours = 0, totalFailHours = 0;
    document.querySelectorAll('.course-item').forEach(course => {
        const grade = course.querySelector('.grade-select').value;
        const hours = parseFloat(course.querySelector('.hours-input').value) || 0;
        const points = gradePoints[grade] || 0;
        totalPoints += points * hours;
        totalHoursForGPA += hours;
        if (grade === 'F') totalFailHours += hours;
        else totalSuccessHours += hours;
    });
    
    const semesterGpa = totalHoursForGPA > 0 ? totalPoints / totalHoursForGPA : 0;
    const completedHours = parseFloat(document.getElementById('completedHours').value) || 0;
    const oldGpa = parseFloat(document.getElementById('oldGpa').value) || 0;
    const oldPoints = oldGpa * completedHours;
    const cumulativeGpa = (completedHours + totalHoursForGPA) > 0 ? (oldPoints + totalPoints) / (completedHours + totalHoursForGPA) : 0;
    const totalPassedHours = completedHours + totalSuccessHours;
    updateEnhancedResults(semesterGpa, cumulativeGpa, totalPassedHours, collegeType, totalGradHours);
}

// إضافة مادة (تم تحديث قائمة الخيارات)
function addCourse(grade = 'A', hours = 3) {
    const container = document.getElementById('coursesContainer');
    const div = document.createElement('div');
    div.className = 'course-item';
    let opts = '';
    for (let g in gradePoints) opts += `<option value="${g}" ${g === grade ? 'selected' : ''}>${g}</option>`;
    div.innerHTML = `<div class="course-grade"><select class="grade-select">${opts}</select></div>
                     <div class="course-hours"><input type="number" class="hours-input" value="${hours}" min="1" max="6" step="1"></div>
                     <button class="delete-course"><i class="fas fa-trash"></i></button>`;
    div.querySelector('.delete-course').onclick = () => { div.remove(); calculateGPA(); };
    div.querySelector('.grade-select').onchange = () => calculateGPA();
    div.querySelector('.hours-input').oninput = () => calculateGPA();
    container.appendChild(div);
    calculateGPA();
}

function resetAll() {
    document.getElementById('completedHours').value = 0;
    document.getElementById('oldGpa').value = 0;
    document.getElementById('coursesContainer').innerHTML = '';
    addCourse();
    calculateGPA();
}

// اللغة (مع تحديث التقييمات)
function switchLanguage(lang) {
    currentLang = lang;
    document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('langAr').classList.toggle('active', lang === 'ar');
    document.getElementById('langEn').classList.toggle('active', lang === 'en');
    const t = lang === 'ar' ? {
        college_title: 'اختر كليتك', total_hours_label: 'إجمالي ساعات التخرج:', previous_title: 'البيانات السابقة',
        completed_hours: 'الساعات المنجزة سابقاً:', old_gpa: 'المعدل التراكمي القديم:', courses_title: 'مواد الفصل الحالي',
        add_course: 'إضافة مادة', calculate: 'احسب المعدل', reset: 'إعادة تعيين', results_title: 'النتائج التفصيلية',
        semester_gpa: 'المعدل الفصلي', cumulative_gpa: 'المعدل التراكمي', total_hours: 'إجمالي الساعات المنجزة',
        conversion_title: 'نظام حساب المعدل:'
    } : {
        college_title: 'Select Your College', total_hours_label: 'Total Graduation Hours:', previous_title: 'Previous Records',
        completed_hours: 'Completed Hours:', old_gpa: 'Previous GPA:', courses_title: 'Current Courses',
        add_course: 'Add Course', calculate: 'Calculate', reset: 'Reset', results_title: 'Detailed Results',
        semester_gpa: 'Semester GPA', cumulative_gpa: 'Cumulative GPA', total_hours: 'Total Passed Hours',
        conversion_title: 'GPA System:'
    };
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        if (t[key]) {
            if (el.tagName === 'INPUT') el.placeholder = t[key];
            else if (el.tagName === 'BUTTON' && el.querySelector('span')) el.querySelector('span').textContent = t[key];
            else el.textContent = t[key];
        }
    });
    calculateGPA(); // لتحديث التقييمات النصية
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
        document.getElementById('mainContent').classList.remove('hidden');
    }, 2000);
    addCourse();
    document.getElementById('addCourseBtn').onclick = () => addCourse();
    document.getElementById('calculateBtn').onclick = () => calculateGPA();
    document.getElementById('resetBtn').onclick = () => resetAll();
    document.getElementById('gpaMode').onclick = () => { currentMode = 'gpa'; document.getElementById('gpaMode').classList.add('active'); document.getElementById('percentMode').classList.remove('active'); calculateGPA(); };
    document.getElementById('percentMode').onclick = () => { currentMode = 'percent'; document.getElementById('percentMode').classList.add('active'); document.getElementById('gpaMode').classList.remove('active'); calculateGPA(); };
    document.getElementById('langAr').onclick = () => switchLanguage('ar');
    document.getElementById('langEn').onclick = () => switchLanguage('en');
    document.querySelectorAll('.college-option').forEach(opt => {
        opt.onclick = function() {
            document.querySelectorAll('.college-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            let newHours = parseInt(this.dataset.hours);
            selectedCollegeHours = newHours;
            document.getElementById('totalGraduationHours').value = newHours;
            calculateGPA();
        };
    });
    document.getElementById('totalGraduationHours').oninput = (e) => { selectedCollegeHours = parseInt(e.target.value) || 171; calculateGPA(); };
    document.getElementById('completedHours').oninput = () => calculateGPA();
    document.getElementById('oldGpa').oninput = () => calculateGPA();
    calculateGPA();
});