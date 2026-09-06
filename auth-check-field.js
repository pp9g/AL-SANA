// دالة التحقق من صلاحيات صفحة الميدان (Field)
async function checkFieldAccess() {
    try {
        // 1. التحقق من وجود جلسة تسجيل دخول نشطة
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
        
        if (sessionError || !session) {
            window.location.href = '/login';
            return;
        }

        // 2. جلب دور المستخدم من جدول profiles
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (profileError || !profile) {
            console.error('Error fetching profile:', profileError);
            alert('حدث خطأ أثناء التحقق من الصلاحيات.');
            return;
        }

        // 3. التحقق من الصلاحية (مسموح لـ field و hybrid فقط)
        if (profile.role !== 'field' && profile.role !== 'hybrid') {
            alert('غير مصرح لك بالوصول لصفحة الميدان (Field)');
            window.location.href = '/office'; // إعادة التوجيه لرابط الأوفيس
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

// تشغيل التحقق فور تحميل الملف
document.addEventListener('DOMContentLoaded', () => {
    checkFieldAccess();
});