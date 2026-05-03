// بيانات التطبيق
let currentLang = 'ar';
let selectedCollegeHours = 171;
let currentMode = 'gpa';

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

// تقييم المعدل حسب نظام 4
function getGpaEvaluation(gpa) {
    if (gpa < 1.0) return { text: 'ضعيف جداً', class: 'very-bad' };
    if (gpa < 1.7) return { text: 'ضعيف', class: 'bad' };
    if (gpa < 2.0) return { text: 'مقبول', class: 'acceptable' };
    if (gpa < 2.7) return { text: 'جيد', class: 'good' };
    if (gpa < 3.5) return { text: 'جيد جداً', class: 'very-good' };
    return { text: 'ممتاز', class: 'excellent' };
}

// تقييم المعدل حسب النظام المئوي
function getPercentEvaluation(percent) {
    if (percent < 60) return { text: 'ضعيف جداً', class: 'very-bad' };
    if (percent < 70) return { text: 'ضعيف', class: 'bad' };
    if (percent < 75) return { text: 'مقبول', class: 'acceptable' };
    if (percent < 85) return { text: 'جيد', class: 'good' };
    if (percent < 95) return { text: 'جيد جداً', class: 'very-good' };
    return { text: 'ممتاز', class: 'excellent' };
}

// تحويل من GPA 4 إلى مئوي
function gpaToPercent(gpa) {
    return (gpa / 4) * 100;
}

// تحويل من مئوي إلى GPA 4
function percentToGpa(percent) {
    return (percent / 100) * 4;
}

// نظام تحديد السنة الدراسية حسب الكلية والساعات
function calculateAcademicYear(totalHours, collegeType) {
    if (collegeType === 'engineering') {
        if (totalHours < 23) return { year: 1, name: 'الأولى', progress: totalHours, required: 23, nextRequirement: 23, percentage: (totalHours / 23) * 100 };
        if (totalHours < 51) return { year: 2, name: 'الثانية', progress: totalHours - 23, required: 28, nextRequirement: 51, percentage: ((totalHours - 23) / 28) * 100 };
        if (totalHours < 82) return { year: 3, name: 'الثالثة', progress: totalHours - 51, required: 31, nextRequirement: 82, percentage: ((totalHours - 51) / 31) * 100 };
        if (totalHours < 114) return { year: 4, name: 'الرابعة', progress: totalHours - 82, required: 32, nextRequirement: 114, percentage: ((totalHours - 82) / 32) * 100 };
        return { year: 5, name: 'الخامسة', progress: totalHours - 114, required: 57, nextRequirement: 171, percentage: Math.min(100, ((totalHours - 114) / 57) * 100) };
    }
    else if (collegeType === 'management') {
        if (totalHours < 23) return { year: 1, name: 'الأولى', progress: totalHours, required: 23, nextRequirement: 23, percentage: (totalHours / 23) * 100 };
        if (totalHours < 51) return { year: 2, name: 'الثانية', progress: totalHours - 23, required: 28, nextRequirement: 51, percentage: ((totalHours - 23) / 28) * 100 };
        if (totalHours < 82) return { year: 3, name: 'الثالثة', progress: totalHours - 51, required: 31, nextRequirement: 82, percentage: ((totalHours - 51) / 31) * 100 };
        return { year: 4, name: 'الرابعة', progress: totalHours - 82, required: 50, nextRequirement: 132, percentage: Math.min(100, ((totalHours - 82) / 50) * 100) };
    }
    else if (collegeType === 'medicine') {
        if (totalHours < 30) return { year: 1, name: 'الأولى', progress: totalHours, required: 30, nextRequirement: 30, percentage: (totalHours / 30) * 100 };
        if (totalHours < 65) return { year: 2, name: 'الثانية', progress: totalHours - 30, required: 35, nextRequirement: 65, percentage: ((totalHours - 30) / 35) * 100 };
        if (totalHours < 100) return { year: 3, name: 'الثالثة', progress: totalHours - 65, required: 35, nextRequirement: 100, percentage: ((totalHours - 65) / 35) * 100 };
        if (totalHours < 135) return { year: 4, name: 'الرابعة', progress: totalHours - 100, required: 35, nextRequirement: 135, percentage: ((totalHours - 100) / 35) * 100 };
        if (totalHours < 170) return { year: 5, name: 'الخامسة', progress: totalHours - 135, required: 35, nextRequirement: 170, percentage: ((totalHours - 135) / 35) * 100 };
        return { year: 6, name: 'السادسة', progress: totalHours - 170, required: 77, nextRequirement: 247, percentage: Math.min(100, ((totalHours - 170) / 77) * 100) };
    }
    return { year: 1, name: 'الأولى', progress: 0, required: 0, percentage: 0 };
}

// عرض معلومات السنة
function displayYearInfo(totalHours, collegeType) {
    const yearInfo = calculateAcademicYear(totalHours, collegeType);
    let statusClass = '';
    let message = '';
    
    if (yearInfo.year === 5 && collegeType === 'engineering' && totalHours >= 171) {
        statusClass = 'graduated';
        message = '🎓 مبروك! أنت مؤهل للتخرج';
    } else if (yearInfo.year === 4 && collegeType === 'management' && totalHours >= 132) {
        statusClass = 'graduated';
        message = '🎓 مبروك! أنت مؤهل للتخرج';
    } else if (yearInfo.year === 6 && collegeType === 'medicine' && totalHours >= 247) {
        statusClass = 'graduated';
        message = '🎓 مبروك! أنت مؤهل للتخرج';
    } else if (yearInfo.progress >= yearInfo.required && yearInfo.required > 0) {
        statusClass = 'eligible';
        message = `✅ أنت مؤهل للترقية إلى السنة ${parseInt(yearInfo.year) + 1}`;
    } else if (yearInfo.required > 0) {
        statusClass = 'warning';
        const remaining = yearInfo.required - yearInfo.progress;
        message = `⚠️ تحتاج ${remaining} ساعة إضافية للترقية إلى السنة ${parseInt(yearInfo.year) + 1}`;
    }
    
    return { yearInfo, message, statusClass };
}

// تحديث خانة التقييم
function updateEvaluationBadge(text, className) {
    const evaluationSpan = document.getElementById('evaluationText');
    if (evaluationSpan) {
        evaluationSpan.textContent = text;
        evaluationSpan.className = `evaluation-badge ${className}`;
    }
}

// ============ الدالة الرئيسية لحساب المعدل ============
function calculateGPA() {
    // تحديد نوع الكلية
    const activeCollege = document.querySelector('.college-option.active');
    let collegeType = 'engineering';
    if (activeCollege) {
        const type = activeCollege.dataset.type;
        if (type === 'management') collegeType = 'management';
        else if (type === 'medicine') collegeType = 'medicine';
        else collegeType = 'engineering';
    }
    
    let totalPoints = 0;
    let totalHoursForGPA = 0;     // كل الساعات (لحساب المعدل)
    let totalSuccessHours = 0;     // الساعات الناجحة فقط (لإجمالي الساعات)
    let totalFailHours = 0;        // الساعات الراسبة (للتحذير)
    
    // جلب جميع المواد
    const allCourses = document.querySelectorAll('.course-item');
    
    for (let i = 0; i < allCourses.length; i++) {
        const course = allCourses[i];
        const gradeSelect = course.querySelector('.grade-select');
        const hoursInput = course.querySelector('.hours-input');
        
        if (!gradeSelect || !hoursInput) continue;
        
        const grade = gradeSelect.value;
        const hours = parseFloat(hoursInput.value) || 0;
        const points = gradePoints[grade] || 0;
        
        // النقاط تحسب دائماً (حتى للراسبة F)
        totalPoints = totalPoints + (points * hours);
        
        // الساعات تحسب لحساب المعدل (كل المواد حتى الراسبة)
        totalHoursForGPA = totalHoursForGPA + hours;
        
        if (grade === 'F') {
            // مادة راسبة: لا تضاف إلى الساعات الناجحة
            totalFailHours = totalFailHours + hours;
        } else {
            // مادة ناجحة: تضاف إلى الساعات الناجحة
            totalSuccessHours = totalSuccessHours + hours;
        }
    }
    
    // حساب المعدل الفصلي (يعتمد على كل المواد حتى الراسبة)
    let semesterGpa = 0;
    if (totalHoursForGPA > 0) {
        semesterGpa = totalPoints / totalHoursForGPA;
    }
    
    // الساعات السابقة (كلها ناجحة)
    const completedHours = parseFloat(document.getElementById('completedHours').value) || 0;
    const oldGpa = parseFloat(document.getElementById('oldGpa').value) || 0;
    
    // حساب المعدل التراكمي (يعتمد على كل المواد)
    const oldPoints = oldGpa * completedHours;
    const totalAllPoints = oldPoints + totalPoints;
    const totalAllHoursForGPA = completedHours + totalHoursForGPA;
    
    let cumulativeGpa = 0;
    if (totalAllHoursForGPA > 0) {
        cumulativeGpa = totalAllPoints / totalAllHoursForGPA;
    }
    
    // إجمالي الساعات المنجزة (فقط المواد الناجحة)
    const totalPassedHours = completedHours + totalSuccessHours;
    
    // عرض النتائج حسب الوضع الحالي (GPA أو مئوي)
    if (currentMode === 'gpa') {
        document.getElementById('semesterGpa').textContent = semesterGpa.toFixed(2);
        document.getElementById('cumulativeGpa').textContent = cumulativeGpa.toFixed(2);
        const evaluation = getGpaEvaluation(cumulativeGpa);
        updateEvaluationBadge(evaluation.text, evaluation.class);
    } else {
        const semesterPercent = gpaToPercent(semesterGpa);
        const cumulativePercent = gpaToPercent(cumulativeGpa);
        document.getElementById('semesterGpa').textContent = semesterPercent.toFixed(1);
        document.getElementById('cumulativeGpa').textContent = cumulativePercent.toFixed(1);
        const evaluation = getPercentEvaluation(cumulativePercent);
        updateEvaluationBadge(evaluation.text, evaluation.class);
    }
    
    // عرض إجمالي الساعات (فقط الناجحة)
    document.getElementById('totalHours').textContent = totalPassedHours;
    
    // إزالة التحذير القديم إذا كان موجود
    const oldWarning = document.querySelector('.failed-warning');
    if (oldWarning) oldWarning.remove();
    
    // إضافة تحذير جديد إذا كان هناك مواد راسبة
    if (totalFailHours > 0) {
        const parent = document.getElementById('totalHours').parentElement;
        const warningSpan = document.createElement('div');
        warningSpan.className = 'failed-warning';
        warningSpan.innerHTML = `⚠️ تنبيه: ${totalFailHours} ساعة مواد راسبة (F) لم تضف إلى إجمالي الساعات المنجزة، ولكنها أثرت على المعدل`;
        warningSpan.style.cssText = 'background:#fee2e2; color:#ef4444; padding:5px 10px; border-radius:8px; font-size:12px; margin-top:8px; text-align:center';
        parent.appendChild(warningSpan);
    }
    
    // حساب نسبة الإنجاز (تعتمد على الساعات الناجحة فقط)
    let progressPercent = 0;
    if (selectedCollegeHours > 0) {
        progressPercent = Math.min(100, (totalPassedHours / selectedCollegeHours) * 100);
    }
    document.getElementById('progressFill').style.width = `${progressPercent}%`;
    document.getElementById('progressPercent').textContent = `${progressPercent.toFixed(1)}%`;
    
    // عرض السنة الدراسية (تعتمد على الساعات الناجحة فقط)
    const yearData = displayYearInfo(totalPassedHours, collegeType);
    const yearSection = document.getElementById('academicYearSection');
    if (yearSection) {
        yearSection.classList.remove('hidden');
        yearSection.innerHTML = `
            <div class="academic-year ${yearData.statusClass}">
                <div class="year-header">
                    <span class="year-icon">📚</span>
                    <h4>السنة الدراسية</h4>
                </div>
                <div class="year-body">
                    <div class="year-number">
                        السنة <strong>${yearData.yearInfo.name}</strong>
                    </div>
                    <div class="year-progress">
                        <div class="progress-label">
                            <span>التقدم للسنة التالية:</span>
                            <span>${Math.floor(yearData.yearInfo.progress)}/${yearData.yearInfo.required} ساعة</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill-year" style="width: ${Math.min(100, yearData.yearInfo.percentage)}%"></div>
                        </div>
                        <div class="year-message ${yearData.statusClass === 'eligible' ? 'success' : ''}">
                            ${yearData.message}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// إضافة مادة جديدة
function addCourse(grade = 'A', hours = 3) {
    const container = document.getElementById('coursesContainer');
    const courseDiv = document.createElement('div');
    courseDiv.className = 'course-item';
    
    // بناء خيارات الرموز
    let gradeOptions = '';
    for (const g in gradePoints) {
        gradeOptions += `<option value="${g}" ${g === grade ? 'selected' : ''}>${g}</option>`;
    }
    
    courseDiv.innerHTML = `
        <div class="course-grade">
            <select class="grade-select">
                ${gradeOptions}
            </select>
        </div>
        <div class="course-hours">
            <input type="number" class="hours-input" value="${hours}" min="1" max="6" step="1">
        </div>
        <button class="delete-course">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    // إضافة حدث الحذف
    const deleteBtn = courseDiv.querySelector('.delete-course');
    deleteBtn.addEventListener('click', function() {
        courseDiv.remove();
        calculateGPA();
    });
    
    // إضافة حدث التغيير
    const gradeSelect = courseDiv.querySelector('.grade-select');
    gradeSelect.addEventListener('change', function() {
        calculateGPA();
    });
    
    const hoursInput = courseDiv.querySelector('.hours-input');
    hoursInput.addEventListener('input', function() {
        calculateGPA();
    });
    
    container.appendChild(courseDiv);
    calculateGPA();
}

// إعادة تعيين كل شيء
function resetAll() {
    document.getElementById('completedHours').value = 0;
    document.getElementById('oldGpa').value = 0;
    document.getElementById('totalGraduationHours').value = selectedCollegeHours;
    document.getElementById('coursesContainer').innerHTML = '';
    addCourse(); // إضافة مادة واحدة افتراضية
}

// تبديل اللغة
function switchLanguage(lang) {
    currentLang = lang;
    document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    
    const arBtn = document.getElementById('langAr');
    const enBtn = document.getElementById('langEn');
    
    if (lang === 'ar') {
        arBtn.classList.add('active');
        enBtn.classList.remove('active');
    } else {
        enBtn.classList.add('active');
        arBtn.classList.remove('active');
    }
    
    // ترجمة النصوص (اختصاراً)
    const translations = {
        ar: {
            college_title: 'اختر كليتك',
            total_hours_label: 'إجمالي ساعات التخرج:',
            previous_title: 'البيانات السابقة',
            completed_hours: 'الساعات المنجزة سابقاً:',
            old_gpa: 'المعدل التراكمي القديم:',
            courses_title: 'مواد الفصل الحالي',
            add_course: 'إضافة مادة',
            calculate: 'احسب المعدل',
            reset: 'إعادة تعيين',
            results_title: 'النتائج',
            semester_gpa: 'المعدل الفصلي:',
            cumulative_gpa: 'المعدل التراكمي:',
            total_hours: 'إجمالي الساعات:',
            progress_label: 'نسبة الإنجاز:',
            evaluation: 'تقييم المعدل:'
        },
        en: {
            college_title: 'Select Your College',
            total_hours_label: 'Total Graduation Hours:',
            previous_title: 'Previous Records',
            completed_hours: 'Completed Hours:',
            old_gpa: 'Previous GPA:',
            courses_title: 'Current Semester Courses',
            add_course: 'Add Course',
            calculate: 'Calculate GPA',
            reset: 'Reset',
            results_title: 'Results',
            semester_gpa: 'Semester GPA:',
            cumulative_gpa: 'Cumulative GPA:',
            total_hours: 'Total Hours:',
            progress_label: 'Completion Progress:',
            evaluation: 'Evaluation:'
        }
    };
    
    const t = translations[lang];
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        if (t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else if (el.tagName === 'BUTTON' && el.querySelector('span')) {
                const span = el.querySelector('span');
                if (span) span.textContent = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });
}

// ============ تهيئة الصفحة عند التحميل ============
document.addEventListener('DOMContentLoaded', function() {
    // إخفاء شاشة الترحيب بعد 2 ثانية
    setTimeout(function() {
        const splash = document.getElementById('splashScreen');
        const main = document.getElementById('mainContent');
        if (splash && main) {
            splash.style.opacity = '0';
            setTimeout(function() {
                splash.style.display = 'none';
                main.classList.remove('hidden');
            }, 500);
        }
    }, 2000);
    
    // إضافة مادة افتراضية
    addCourse();
    
    // ربط الأزرار
    const addBtn = document.getElementById('addCourseBtn');
    if (addBtn) addBtn.addEventListener('click', function() { addCourse(); });
    
    const calcBtn = document.getElementById('calculateBtn');
    if (calcBtn) calcBtn.addEventListener('click', function() { calculateGPA(); });
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', function() { resetAll(); });
    
    // ربط أزرار تحويل المعدل
    const gpaModeBtn = document.getElementById('gpaMode');
    const percentModeBtn = document.getElementById('percentMode');
    
    if (gpaModeBtn) {
        gpaModeBtn.addEventListener('click', function() {
            currentMode = 'gpa';
            gpaModeBtn.classList.add('active');
            if (percentModeBtn) percentModeBtn.classList.remove('active');
            document.getElementById('semesterUnit').textContent = '/ 4.00';
            document.getElementById('cumulativeUnit').textContent = '/ 4.00';
            calculateGPA();
        });
    }
    
    if (percentModeBtn) {
        percentModeBtn.addEventListener('click', function() {
            currentMode = 'percent';
            percentModeBtn.classList.add('active');
            if (gpaModeBtn) gpaModeBtn.classList.remove('active');
            document.getElementById('semesterUnit').textContent = '%';
            document.getElementById('cumulativeUnit').textContent = '%';
            calculateGPA();
        });
    }
    
    // ربط أزرار اللغة
    const langArBtn = document.getElementById('langAr');
    const langEnBtn = document.getElementById('langEn');
    
    if (langArBtn) langArBtn.addEventListener('click', function() { switchLanguage('ar'); });
    if (langEnBtn) langEnBtn.addEventListener('click', function() { switchLanguage('en'); });
    
    // ربط خيارات الكلية
    const collegeOptions = document.querySelectorAll('.college-option');
    collegeOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            collegeOptions.forEach(function(opt) { opt.classList.remove('active'); });
            this.classList.add('active');
            selectedCollegeHours = parseInt(this.dataset.hours) || 171;
            const totalHoursInput = document.getElementById('totalGraduationHours');
            if (totalHoursInput) totalHoursInput.value = selectedCollegeHours;
            calculateGPA();
        });
    });
    
    // ربط إدخال الساعات الكلية
    const totalGradHours = document.getElementById('totalGraduationHours');
    if (totalGradHours) {
        totalGradHours.addEventListener('input', function(e) {
            selectedCollegeHours = parseInt(e.target.value) || 171;
            calculateGPA();
        });
    }
    
    // ربط الساعات السابقة والمعدل القديم
    const completedHoursInput = document.getElementById('completedHours');
    if (completedHoursInput) completedHoursInput.addEventListener('input', function() { calculateGPA(); });
    
    const oldGpaInput = document.getElementById('oldGpa');
    if (oldGpaInput) oldGpaInput.addEventListener('input', function() { calculateGPA(); });
    
    // حساب أولي
    calculateGPA();
});