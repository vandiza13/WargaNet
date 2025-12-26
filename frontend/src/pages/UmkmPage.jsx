import React, { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { Plus, Search, MapPin, Phone, CheckCircle, Clock, ShoppingBag } from 'lucide-react';

const UmkmPage = () => {
    const [umkmList, setUmkmList] = useState([]);
    const [myUmkmList, setMyUmkmList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUmkm, setNewUmkm] = useState({ 
        name: '', 
        description: '', 
        category: 'Lainnya', 
        contact: '', 
        alamat: '',
        jamOperasional: '',
        harga: 'Menengah (50k - 200k)', 
        sosmed: { instagram: '', facebook: '', whatsapp: '' }
    });

    const fetchUmkmData = async () => {
        try {
            const [listRes, myUmkmRes] = await Promise.all([
                API.get('/umkm/directory'),
                API.get('/umkm/myumkm')
            ]);
            setUmkmList(listRes.data);
            setMyUmkmList(myUmkmRes.data);
        } catch (error) {
            console.error("Gagal memuat data UMKM:", error);
        }
    };

    useEffect(() => {
        fetchUmkmData();
    }, []);

    const handleRegister = async () => {
        if (!newUmkm.name || !newUmkm.description || !newUmkm.contact || !newUmkm.alamat) {
            alert("Harap isi semua kolom yang wajib diisi (*).");
            return;
        }
        try {
            await API.post('/umkm', newUmkm);
            fetchUmkmData();
            setIsModalOpen(false);
            setNewUmkm({ 
                name: '', description: '', category: 'Lainnya', contact: '', alamat: '',
                jamOperasional: '', harga: 'Menengah (50k - 200k)', 
                sosmed: { instagram: '', facebook: '', whatsapp: '' }
            });
            alert('UMKM Anda berhasil didaftarkan dan sedang menunggu persetujuan admin.');
        } catch (error) {
            console.error("Gagal mendaftarkan UMKM:", error);
            alert(`Gagal mendaftarkan UMKM: ${error.response?.data?.message || error.message}`);
        }
    };

    const filteredUmkm = umkmList.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="UMKM Lokal"
                subtitle="Dukung usaha kecil menengah di komunitas Anda"
                breadcrumbs={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'UMKM', path: '/umkm' }
                ]}
                icon={ShoppingBag}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari UMKM..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUmkm.map(item => (
                        <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                            <img
                                src={item.imageUrl || `https://placehold.co/600x400/E2E8F0/475569?text=${encodeURIComponent(item.name)}`}
                                alt={item.name}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
                                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-primary-50 text-primary-700">{item.category}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4 flex-grow">{item.description}</p>
                                <div className="space-y-2 text-sm text-gray-500 border-t pt-4 mt-auto">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>{item.alamat || item.owner.noRumah}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-gray-400" />
                                        <a href={`tel:${item.contact}`} className="text-primary-600 hover:underline">{item.contact || '-'}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredUmkm.length === 0 && (
                     <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <Search className="mx-auto text-gray-300" size={48}/>
                        <h3 className="mt-2 text-lg font-medium text-gray-800">Tidak Ditemukan</h3>
                        <p className="mt-1 text-sm text-gray-500">UMKM yang Anda cari tidak ditemukan.</p>
                    </div>
                )}

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Daftarkan Usaha Anda" icon="Store">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-sm font-medium">Nama Usaha *</label>
                            <input type="text" placeholder="Contoh: Warung Makan Sederhana" value={newUmkm.name} onChange={e => setNewUmkm({ ...newUmkm, name: e.target.value })} className="w-full p-2 border rounded-lg mt-1" />
                        </div>
                         <div className="col-span-2">
                            <label className="text-sm font-medium">Deskripsi Usaha *</label>
                            <textarea rows="3" placeholder="Jelaskan produk/jasa yang Anda tawarkan..." value={newUmkm.description} onChange={e => setNewUmkm({ ...newUmkm, description: e.target.value })} className="w-full p-2 border rounded-lg mt-1" />
                        </div>
                         <div>
                            <label className="text-sm font-medium">Kategori *</label>
                            <select value={newUmkm.category} onChange={e => setNewUmkm({ ...newUmkm, category: e.target.value })} className="w-full p-2 border rounded-lg mt-1 bg-white">
                                <option>Makanan & Minuman</option><option>Fashion</option><option>Kerajinan</option>
                                <option>Jasa</option><option>Pertanian</option><option>Teknologi</option><option>Lainnya</option>
                            </select>
                        </div>
                         <div>
                            <label className="text-sm font-medium">Range Harga</label>
                             <select value={newUmkm.harga} onChange={e => setNewUmkm({ ...newUmkm, harga: e.target.value })} className="w-full p-2 border rounded-lg mt-1 bg-white">
                                <option>Murah (&lt; 50k)</option>
                                <option>Menengah (50k - 200k)</option>
                                <option>Premium (&gt; 200k)</option>
                            </select>
                        </div>
                         <div className="col-span-2">
                            <label className="text-sm font-medium">Nomor Kontak *</label>
                            <input type="text" placeholder="08xxxxxxxxxx" value={newUmkm.contact} onChange={e => setNewUmkm({ ...newUmkm, contact: e.target.value })} className="w-full p-2 border rounded-lg mt-1" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm font-medium">Alamat Usaha *</label>
                            <input type="text" placeholder="Alamat lengkap usaha" value={newUmkm.alamat} onChange={e => setNewUmkm({ ...newUmkm, alamat: e.target.value })} className="w-full p-2 border rounded-lg mt-1" />
                        </div>
                         <div className="col-span-2">
                            <label className="text-sm font-medium">Jam Operasional</label>
                            <input type="text" placeholder="Contoh: Senin-Sabtu 08:00-17:00" value={newUmkm.jamOperasional} onChange={e => setNewUmkm({ ...newUmkm, jamOperasional: e.target.value })} className="w-full p-2 border rounded-lg mt-1" />
                        </div>
                        <div className="col-span-2">
                             <label className="text-sm font-medium">Media Sosial (Opsional)</label>
                             <div className="grid grid-cols-3 gap-2 mt-1">
                                 <input type="text" placeholder="Instagram" value={newUmkm.sosmed.instagram} onChange={e => setNewUmkm({ ...newUmkm, sosmed: {...newUmkm.sosmed, instagram: e.target.value} })} className="w-full p-2 border rounded-lg" />
                                 <input type="text" placeholder="Facebook" value={newUmkm.sosmed.facebook} onChange={e => setNewUmkm({ ...newUmkm, sosmed: {...newUmkm.sosmed, facebook: e.target.value} })} className="w-full p-2 border rounded-lg" />
                                 <input type="text" placeholder="WhatsApp" value={newUmkm.sosmed.whatsapp} onChange={e => setNewUmkm({ ...newUmkm, sosmed: {...newUmkm.sosmed, whatsapp: e.target.value} })} className="w-full p-2 border rounded-lg" />
                             </div>
                        </div>
                         <div className="col-span-2">
                            <label className="text-sm font-medium">Foto Produk/Usaha</label>
                             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    <div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"><p>Upload Foto</p></label></div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 flex justify-end gap-4 pt-2">
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">Batal</button>
                            <button onClick={handleRegister} className="bg-primary-600 text-white px-6 py-2 rounded-lg">Daftar</button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};
export default UmkmPage;

