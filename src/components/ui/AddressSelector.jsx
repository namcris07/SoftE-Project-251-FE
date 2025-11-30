import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Search } from "lucide-react"; // Import icon search

// URL API
const API_HOST = "https://provinces.open-api.vn/api/v2";

export function AddressSelector({ value, onChange, disabled }) {
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  // State tìm kiếm local
  const [searchProvince, setSearchProvince] = useState("");
  const [searchWard, setSearchWard] = useState("");

  // State lưu giá trị đang chọn
  const [selected, setSelected] = useState({
    province: null,
    ward: null,
    street: "",
  });

  // Parse giá trị cũ để hiển thị (Optional - Tách chuỗi địa chỉ cũ)
  // VD: "123 Đường A, Xã B, Tỉnh C" -> Lấy "123 Đường A" đưa vào ô street
  useEffect(() => {
    if (value && !selected.street && !selected.province) {
      const parts = value.split(", ");
      if (parts.length > 2) {
        // Giả định format: [Street, Ward, Province]
        setSelected((prev) => ({ ...prev, street: parts[0] }));
      }
    }
  }, [value]);

  // 1. Load Tỉnh
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get(`${API_HOST}/p/`);
        setProvinces(res.data);
      } catch (error) {
        console.error("Lỗi load tỉnh:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Filter danh sách Tỉnh theo từ khóa tìm kiếm
  const filteredProvinces = useMemo(
    () =>
      provinces.filter((p) =>
        p.name.toLowerCase().includes(searchProvince.toLowerCase())
      ),
    [provinces, searchProvince]
  );

  // Filter danh sách Xã
  const filteredWards = useMemo(
    () =>
      wards.filter((w) =>
        w.name.toLowerCase().includes(searchWard.toLowerCase())
      ),
    [wards, searchWard]
  );

  // 2. Chọn Tỉnh
  const handleProvinceChange = async (provinceCodeStr) => {
    const provinceCode = parseInt(provinceCodeStr);
    const prov = provinces.find((p) => p.code === provinceCode);

    setSelected((prev) => ({ ...prev, province: prov, ward: null }));
    setWards([]);
    setSearchWard(""); // Reset search xã

    try {
      const res = await axios.get(`${API_HOST}/p/${provinceCode}?depth=2`);
      if (res.data && res.data.wards) {
        setWards(res.data.wards);
      }
      triggerChange(prov, null, selected.street);
    } catch (error) {
      console.error("Lỗi load xã:", error);
    }
  };

  // 3. Chọn Xã
  const handleWardChange = (wardCodeStr) => {
    const wardCode = parseInt(wardCodeStr);
    const ward = wards.find((w) => w.code === wardCode);
    setSelected((prev) => ({ ...prev, ward: ward }));
    triggerChange(selected.province, ward, selected.street);
  };

  // 4. Nhập số nhà
  const handleStreetChange = (e) => {
    const val = e.target.value;
    setSelected((prev) => ({ ...prev, street: val }));
    triggerChange(selected.province, selected.ward, val);
  };

  const triggerChange = (p, w, s) => {
    if (!onChange) return;
    const parts = [];
    if (s) parts.push(s);
    if (w) parts.push(w.name);
    if (p) parts.push(p.name);
    onChange(parts.join(", "));
  };

  return (
    <div className="space-y-3">
      {/* Hiển thị địa chỉ hiện tại (nếu có) để tham khảo */}
      {value && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded border mb-2">
          Hiện tại: <b>{value}</b>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Select Tỉnh (Có Search) */}
        <Select onValueChange={handleProvinceChange} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn Tỉnh / Thành phố" />
          </SelectTrigger>
          <SelectContent>
            {/* Ô tìm kiếm dính bên trong dropdown */}
            <div className="p-2 sticky top-0 bg-white z-10 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  className="w-full border rounded px-8 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Tìm tỉnh thành..."
                  value={searchProvince}
                  onChange={(e) => setSearchProvince(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()} // Chặn phím để không bị đóng dropdown
                />
              </div>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {filteredProvinces.length > 0 ? (
                filteredProvinces.map((p) => (
                  <SelectItem key={p.code} value={String(p.code)}>
                    {p.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500 text-center">
                  Không tìm thấy
                </div>
              )}
            </div>
          </SelectContent>
        </Select>

        {/* Select Xã (Có Search) */}
        <Select
          onValueChange={handleWardChange}
          disabled={disabled || !selected.province || wards.length === 0}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn Phường / Xã" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2 sticky top-0 bg-white z-10 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  className="w-full border rounded px-8 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Tìm phường xã..."
                  value={searchWard}
                  onChange={(e) => setSearchWard(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {filteredWards.length > 0 ? (
                filteredWards.map((w) => (
                  <SelectItem key={w.code} value={String(w.code)}>
                    {w.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm text-gray-500 text-center">
                  Không tìm thấy
                </div>
              )}
            </div>
          </SelectContent>
        </Select>
      </div>

      <Input
        placeholder="Số nhà, tên đường..."
        value={selected.street}
        onChange={handleStreetChange}
        disabled={disabled}
      />
    </div>
  );
}
