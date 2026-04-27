# backend/utils/curriculum.py

import random

# =========================
# DATA KURIKULUM (CONTOH)
# =========================

CURRICULUM = {
    "TI": {
        1: [
            {"kode": "TI101", "nama": "Dasar Pemrograman", "sks": 3, "wajib": True},
            {"kode": "TI102", "nama": "Matematika Diskrit", "sks": 3, "wajib": True},
            {"kode": "TI103", "nama": "Pengantar TI", "sks": 2, "wajib": True},
            {"kode": "TI104", "nama": "Logika Informatika", "sks": 2, "wajib": True},
            {"kode": "TI105", "nama": "Bahasa Inggris", "sks": 2, "wajib": False},
        ],
        2: [
            {"kode": "TI201", "nama": "Struktur Data", "sks": 3, "wajib": True},
            {"kode": "TI202", "nama": "Basis Data", "sks": 3, "wajib": True},
            {"kode": "TI203", "nama": "Algoritma", "sks": 3, "wajib": True},
            {"kode": "TI204", "nama": "Sistem Operasi", "sks": 3, "wajib": True},
            {"kode": "TI205", "nama": "UI/UX", "sks": 2, "wajib": False},
        ],
        3: [
            {"kode": "TI301", "nama": "Pemrograman Web", "sks": 3, "wajib": True},
            {"kode": "TI302", "nama": "Jaringan Komputer", "sks": 3, "wajib": True},
            {"kode": "TI303", "nama": "AI Dasar", "sks": 3, "wajib": True},
            {"kode": "TI304", "nama": "Cloud Computing", "sks": 3, "wajib": True},
            {"kode": "TI305", "nama": "Mobile Dev", "sks": 2, "wajib": False},
        ],
        4: [
            {"kode": "TI401", "nama": "Machine Learning", "sks": 3, "wajib": True},
            {"kode": "TI402", "nama": "Big Data", "sks": 3, "wajib": True},
            {"kode": "TI403", "nama": "Keamanan Sistem", "sks": 3, "wajib": True},
            {"kode": "TI404", "nama": "DevOps", "sks": 3, "wajib": True},
            {"kode": "TI405", "nama": "Game Dev", "sks": 2, "wajib": False},
        ],
        5: [
            {"kode": "TI501", "nama": "Data Science", "sks": 3, "wajib": True},
            {"kode": "TI502", "nama": "IoT", "sks": 3, "wajib": True},
            {"kode": "TI503", "nama": "Blockchain", "sks": 3, "wajib": True},
            {"kode": "TI504", "nama": "AR/VR", "sks": 3, "wajib": True},
        ],
        6: [
            {"kode": "TI601", "nama": "Tugas Akhir", "sks": 6, "wajib": True},
            {"kode": "TI602", "nama": "Kerja Praktek", "sks": 3, "wajib": True},
            {"kode": "TI603", "nama": "Seminar", "sks": 2, "wajib": True},
        ],
    }
}


# =========================
# FUNGSI UTAMA
# =========================

def get_wajib_courses(prodi_key, semester):
    """Ambil matkul wajib"""
    courses = CURRICULUM.get(prodi_key, {}).get(semester, [])
    return [c for c in courses if c["wajib"]]


def get_pilihan_courses(prodi_key, semester):
    """Ambil matkul pilihan"""
    courses = CURRICULUM.get(prodi_key, {}).get(semester, [])
    return [c for c in courses if not c["wajib"]]


def get_prodi(nim: str) -> str:
    """
    Ambil kode prodi dari NIM
    Contoh: 22101123 -> 10 (TI misalnya)
    """
    kode = nim[2:4]

    mapping = {
        "10": "TI",
        "11": "AK",
        "12": "TM",
        "13": "AP"
    }

    return mapping.get(kode, "TI")


def get_max_sks_by_ipk(ipk, semester):
    """Aturan SKS berdasarkan IPK"""
    if ipk >= 3.0:
        return 24
    elif ipk >= 2.5:
        return 22
    else:
        return 20


def validate_prerequisites(kode_matkul, completed_courses):
    """
    Dummy validasi prasyarat
    (bisa kamu kembangkan nanti)
    """
    # contoh: Struktur Data harus lulus Dasar Pemrograman
    prerequisites = {
        "TI201": ["TI101"]
    }

    if kode_matkul not in prerequisites:
        return True

    return all(pr in completed_courses for pr in prerequisites[kode_matkul])


def get_completed_courses(riwayat):
    """
    riwayat: list of dict
    contoh: [{"kode": "TI101", "lulus": True}]
    """
    return {r["kode"] for r in riwayat if r["lulus"]}


# =========================
# HELPER (OPSIONAL)
# =========================

def generate_krs(prodi_key, semester, ipk, completed_courses):
    """
    Generate rekomendasi KRS
    """
    max_sks = get_max_sks_by_ipk(ipk, semester)

    wajib = get_wajib_courses(prodi_key, semester)
    pilihan = get_pilihan_courses(prodi_key, semester)

    hasil = []
    total_sks = 0

    # ambil wajib dulu
    for matkul in wajib:
        if validate_prerequisites(matkul["kode"], completed_courses):
            hasil.append(matkul)
            total_sks += matkul["sks"]

    # tambah pilihan kalau masih cukup SKS
    random.shuffle(pilihan)

    for matkul in pilihan:
        if total_sks + matkul["sks"] <= max_sks:
            hasil.append(matkul)
            total_sks += matkul["sks"]

    return hasil
