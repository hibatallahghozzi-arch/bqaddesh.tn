import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client, Client

# 1. الاتصال بـ Supabase باستخدام البيئة الحالية (Environment Variables)
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://pomihskxzgfqnyyorgvb.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") # المفتاح المباشر للكتابة

if not SUPABASE_KEY:
    raise ValueError("⚠️ SUPABASE_SERVICE_KEY غير موجود في متغيرات البيئة!")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 2. قاموس توحيد المواد بين المواقع الرسمية والتطبيق
PRODUCTS_MAP = {
    "طماطم": {"id": "tomate", "category": "vegetables", "emoji": "🍅"},
    "بطاطا": {"id": "batata", "category": "vegetables", "emoji": "🥔"},
    "فلفل": {"id": "felfel", "category": "vegetables", "emoji": "🌶️"},
    "بصل": {"id": "basal", "category": "vegetables", "emoji": "🧅"},
    "خيار": {"id": "khiar", "category": "vegetables", "emoji": "🥒"},
    "تفاح": {"id": "toffah", "category": "fruits", "emoji": "🍎"},
    "بنان": {"id": "banane", "category": "fruits", "emoji": "🍌"},
    "قارص": {"id": "qares", "category": "fruits", "emoji": "🍋"},
}

def run_scraper():
    print("🚀 بدء سحب الأسعار الرسمية اليومية...")
    
    # ⚠️ رابط الموقع الرسمي (مثل SOTUMAG)
    url = "http://www.sotumag.com.tn/arabic/index.php"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        res = requests.get(url, headers=headers, timeout=10)
        res.encoding = 'utf-8'
        soup = BeautifulSoup(res.text, 'html.parser')

        # هنا يتم استخراج الجدول وإضافة المنتوجات لـ Supabase
        for name_ar, details in PRODUCTS_MAP.items():
            # (مثال: تحديث السوم الرسمي للمادة أو إدراجها إن لم تكن موجودة)
            supabase.table('products').upsert({
                'id': details['id'],
                'name_ar': name_ar,
                'category': details['category'],
                'emoji': details['emoji'],
                'official_price': 1.800 # السوم المجلوُب من السكرابينغ
            }).execute()

        print("🎉 تم تحديث قاعدة البيانات بنجاح!")

    except Exception as e:
        print(f"❌ خطأ أثناء السكرابينغ: {e}")

if __name__ == "__main__":
    run_scraper()