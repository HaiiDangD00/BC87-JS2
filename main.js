// Xử lý logic tuyển sinh

document.getElementById('admissionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Lấy dữ liệu từ form
    const diemChuan = parseFloat(document.getElementById('diemChuan').value);
    const diem1 = parseFloat(document.getElementById('diem1').value);
    const diem2 = parseFloat(document.getElementById('diem2').value);
    const diem3 = parseFloat(document.getElementById('diem3').value);
    const khuVuc = document.getElementById('khuVuc').value;
    const doiTuong = document.getElementById('doiTuong').value;

    // Tính điểm ưu tiên khu vực
    let diemUuTienKhuVuc = 0;
    if (khuVuc === 'A') diemUuTienKhuVuc = 2;
    else if (khuVuc === 'B') diemUuTienKhuVuc = 1;
    else if (khuVuc === 'C') diemUuTienKhuVuc = 0.5;

    // Tính điểm ưu tiên đối tượng
    let diemUuTienDoiTuong = 0;
    if (doiTuong === '1') diemUuTienDoiTuong = 2.5;
    else if (doiTuong === '2') diemUuTienDoiTuong = 1.5;
    else if (doiTuong === '3') diemUuTienDoiTuong = 1;

    // Tổng điểm ưu tiên
    const diemUuTien = diemUuTienKhuVuc + diemUuTienDoiTuong;
    // Tổng điểm
    const tongDiem = diem1 + diem2 + diem3 + diemUuTien;

    // Kiểm tra có môn nào 0 điểm không
    let rot = false;
    if (diem1 === 0 || diem2 === 0 || diem3 === 0) rot = true;
    // Kiểm tra tổng điểm
    if (tongDiem < diemChuan) rot = true;

    // Hiển thị kết quả
    const ketQuaDiv = document.getElementById('ketQua');
    if (rot) {
        ketQuaDiv.textContent = `Rớt. Tổng điểm đạt được: ${tongDiem}`;
    } else {
        ketQuaDiv.textContent = `Đậu! Tổng điểm đạt được: ${tongDiem}`;
    }
});

// Xử lý logic tính tiền điện

document.getElementById('electricForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const tenChuHo = document.getElementById('tenChuHo').value.trim();
    const soKw = parseFloat(document.getElementById('soKw').value);
    let tongTien = 0;
    let kwConLai = soKw;

    if (soKw <= 0 || isNaN(soKw)) {
        document.getElementById('ketQuaDien').textContent = 'Vui lòng nhập số Kw hợp lệ!';
        return;
    }

    if (kwConLai > 0) {
        let bac = Math.min(kwConLai, 50);
        tongTien += bac * 500;
        kwConLai -= bac;
    }
    if (kwConLai > 0) {
        let bac = Math.min(kwConLai, 50);
        tongTien += bac * 650;
        kwConLai -= bac;
    }
    if (kwConLai > 0) {
        let bac = Math.min(kwConLai, 100);
        tongTien += bac * 850;
        kwConLai -= bac;
    }
    if (kwConLai > 0) {
        let bac = Math.min(kwConLai, 150);
        tongTien += bac * 1100;
        kwConLai -= bac;
    }
    if (kwConLai > 0) {
        tongTien += kwConLai * 1300;
    }

    document.getElementById('ketQuaDien').textContent = `Chủ hộ: ${tenChuHo} | Số Kw: ${soKw} | Tiền điện: ${tongTien.toLocaleString()}đ`;
});

// Xử lý logic tính thuế thu nhập cá nhân

document.getElementById('taxForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('taxName').value.trim();
    const income = parseFloat(document.getElementById('taxIncome').value); // triệu
    const dep = parseInt(document.getElementById('taxDep').value);
    const resultDiv = document.getElementById('ketQuaThue');

    if (!name || isNaN(income) || income <= 0 || isNaN(dep) || dep < 0) {
        resultDiv.textContent = 'Vui lòng nhập đầy đủ và hợp lệ!';
        return;
    }

    // Tính thu nhập chịu thuế
    let taxable = income - 4 - dep * 1.6;
    if (taxable <= 0) {
        resultDiv.textContent = `Họ tên: ${name} | Không phải nộp thuế.`;
        return;
    }

    // Tính thuế theo bậc thang lũy tiến
    let tax = 0;
    let thueConLai = taxable;
    const bac = [60, 60, 90, 174, 240, 336];
    const rate = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35];
    for (let i = 0; i < bac.length; i++) {
        if (thueConLai > 0) {
            let used = Math.min(thueConLai, bac[i]);
            tax += used * rate[i];
            thueConLai -= used;
        }
    }
    if (thueConLai > 0) {
        tax += thueConLai * rate[rate.length - 1];
    }

    // Đổi thuế sang VND, dùng NumberFormat cho đẹp
    const taxVND = new Intl.NumberFormat('vi-VN').format(Math.round(tax * 1_000_000));
    resultDiv.textContent = `Họ tên: ${name} | Thu nhập chịu thuế: ${taxable} triệu | Thuế phải nộp: ${taxVND} VND`;
});

// Ẩn/hiện ô số kết nối theo loại khách hàng
const loaiKhachHang = document.getElementById('loaiKhachHang');
const soKetNoi = document.getElementById('soKetNoi');
const cableForm = document.getElementById('cableForm');
const rowKetNoi = document.getElementById('row-ketnoi');
loaiKhachHang.addEventListener('change', function() {
    if (this.value === 'DN') {
        rowKetNoi.style.display = 'flex';
        soKetNoi.required = true;
    } else {
        rowKetNoi.style.display = 'none';
        soKetNoi.required = false;
        soKetNoi.value = '';
    }
});

document.getElementById('cableForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const maKH = document.getElementById('maKhachHang').value.trim();
    const loai = document.getElementById('loaiKhachHang').value;
    const kenh = parseInt(document.getElementById('soKenh').value);
    const ketNoi = parseInt(document.getElementById('soKetNoi').value);
    const resultDiv = document.getElementById('ketQuaCap');

    if (!maKH || !loai || isNaN(kenh) || kenh < 0 || (loai === 'DN' && (isNaN(ketNoi) || ketNoi < 1))) {
        resultDiv.textContent = 'Vui lòng nhập đầy đủ và hợp lệ!';
        return;
    }

    let phiXuLy = 0, phiCoBan = 0, phiKenh = 0;
    if (loai === 'ND') {
        phiXuLy = 4.5;
        phiCoBan = 20.5;
        phiKenh = kenh * 7.5;
    } else {
        phiXuLy = 15;
        phiCoBan = 75;
        if (ketNoi > 10) {
            phiCoBan += (ketNoi - 10) * 5;
        }
        phiKenh = kenh * 50;
    }
    const tong = phiXuLy + phiCoBan + phiKenh;
    resultDiv.textContent = `Mã KH: ${maKH} | Loại: ${loai === 'ND' ? 'Nhà dân' : 'Doanh nghiệp'} | Tiền cáp: $${tong.toLocaleString()}`;
});
