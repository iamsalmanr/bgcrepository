import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function FeesTableEditor({ value, onChange }) {
    const [data, setData] = useState({ membership_fees: [], other_charges: [] });

    useEffect(() => {
        try {
            const parsed = typeof value === 'string' ? JSON.parse(value) : value;
            if (parsed && parsed.is_fees_data) {
                setData(parsed);
            }
        } catch (e) {
            // If it's not valid JSON yet (e.g. they just switched to this component), we use default
        }
    }, []);

    const handleChange = (table, index, field, val) => {
        const newData = { ...data };
        newData[table][index][field] = val;
        setData(newData);
        onChange(JSON.stringify({ ...newData, is_fees_data: true }));
    };

    const handleAddRow = (table, template) => {
        const newData = { ...data };
        if (!newData[table]) newData[table] = [];
        newData[table].push(template);
        setData(newData);
        onChange(JSON.stringify({ ...newData, is_fees_data: true }));
    };

    const handleRemoveRow = (table, index) => {
        const newData = { ...data };
        newData[table].splice(index, 1);
        setData(newData);
        onChange(JSON.stringify({ ...newData, is_fees_data: true }));
    };

    return (
        <div className="space-y-8 bg-slate-50 p-6 rounded-lg border border-slate-200">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">1. Membership Fees / Various Charges</h3>
                    <button 
                        type="button" 
                        onClick={() => handleAddRow('membership_fees', { category: '', entry: '', monthly: '', green_non: '', green_other: '', caddie: '', ball_boy: '' })}
                        className="bg-military-600 text-white px-3 py-1.5 rounded text-sm flex items-center hover:bg-military-700"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add Row
                    </button>
                </div>
                <div className="overflow-x-auto bg-white rounded shadow-sm border border-slate-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
                            <tr>
                                <th className="px-3 py-2">Category</th>
                                <th className="px-3 py-2">Entry Fee</th>
                                <th className="px-3 py-2">Monthly Sub.</th>
                                <th className="px-3 py-2">Green (Non-Member)</th>
                                <th className="px-3 py-2">Green (Other Club)</th>
                                <th className="px-3 py-2">Caddie</th>
                                <th className="px-3 py-2">Ball Boy</th>
                                <th className="px-3 py-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.membership_fees?.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.category} onChange={e => handleChange('membership_fees', i, 'category', e.target.value)} /></td>
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.entry} onChange={e => handleChange('membership_fees', i, 'entry', e.target.value)} /></td>
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.monthly} onChange={e => handleChange('membership_fees', i, 'monthly', e.target.value)} /></td>
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.green_non} onChange={e => handleChange('membership_fees', i, 'green_non', e.target.value)} /></td>
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.green_other} onChange={e => handleChange('membership_fees', i, 'green_other', e.target.value)} /></td>
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.caddie} onChange={e => handleChange('membership_fees', i, 'caddie', e.target.value)} /></td>
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.ball_boy} onChange={e => handleChange('membership_fees', i, 'ball_boy', e.target.value)} /></td>
                                    <td className="p-2 text-center">
                                        <button type="button" onClick={() => handleRemoveRow('membership_fees', i)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800">2. Other Charges</h3>
                    <button 
                        type="button" 
                        onClick={() => handleAddRow('other_charges', { category: '', practice: '', tournament: '', trolley: '', driving: '', locker: '', remark: '' })}
                        className="bg-military-600 text-white px-3 py-1.5 rounded text-sm flex items-center hover:bg-military-700"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add Row
                    </button>
                </div>
                <div className="overflow-x-auto bg-white rounded shadow-sm border border-slate-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
                            <tr>
                                <th className="px-3 py-2">Category</th>
                                <th className="px-3 py-2">Practice</th>
                                <th className="px-3 py-2">Tournament</th>
                                <th className="px-3 py-2">Trolley</th>
                                <th className="px-3 py-2">Driving Range</th>
                                <th className="px-3 py-2">Locker</th>
                                <th className="px-3 py-2">Remark</th>
                                <th className="px-3 py-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.other_charges?.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.category} onChange={e => handleChange('other_charges', i, 'category', e.target.value)} /></td>
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.practice} onChange={e => handleChange('other_charges', i, 'practice', e.target.value)} /></td>
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.tournament} onChange={e => handleChange('other_charges', i, 'tournament', e.target.value)} /></td>
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.trolley} onChange={e => handleChange('other_charges', i, 'trolley', e.target.value)} /></td>
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.driving} onChange={e => handleChange('other_charges', i, 'driving', e.target.value)} /></td>
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.locker} onChange={e => handleChange('other_charges', i, 'locker', e.target.value)} /></td>
                                    <td className="p-2"><input type="text" className="w-full text-sm border-slate-200 rounded p-1" value={row.remark} onChange={e => handleChange('other_charges', i, 'remark', e.target.value)} /></td>
                                    <td className="p-2 text-center">
                                        <button type="button" onClick={() => handleRemoveRow('other_charges', i)} className="text-red-500 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <p className="text-xs text-slate-500 italic mt-4">
                Note: Saving this page will store the JSON representation of this table in the database, allowing the public site to render it correctly. Do not change the page slug unless necessary, as the custom layout depends on the slug being "fees".
            </p>
        </div>
    );
}
