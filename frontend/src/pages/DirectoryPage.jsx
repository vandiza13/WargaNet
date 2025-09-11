import React, { useState, useEffect } from 'react';
import API from '../services/api';

const DirectoryPage = () => {
    const [directory, setDirectory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDirectory = async () => {
            const { data } = await API.get('/users/directory');
            setDirectory(data);
        };
        fetchDirectory();
    }, []);

    const filteredDirectory = directory.filter(warga => 
        warga.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        warga.noRumah.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Direktori Warga</h1>
            <div className="mb-4">
                <input 
                    type="text" 
                    placeholder="Cari nama atau nomor rumah..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full max-w-md p-3 border rounded-lg"
                />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3">Nama Lengkap</th>
                            <th className="p-3">Nomor Rumah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDirectory.map(warga => (
                            <tr key={warga._id} className="border-b hover:bg-slate-50">
                                <td className="p-3">{warga.nama}</td>
                                <td className="p-3">{warga.noRumah}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default DirectoryPage;
