import React from 'react';
import * as LucideIcons from 'lucide-react';

const Icon = ({ name, ...props }) => {
    // Menambahkan ikon yang mungkin tidak ada di versi lama
    const AllIcons = { ...LucideIcons, Wallet: LucideIcons.Wallet || LucideIcons.CreditCard, Store: LucideIcons.Store || LucideIcons.Home, ClipboardCheck: LucideIcons.ClipboardCheck || LucideIcons.Clipboard, BookCopy: LucideIcons.BookCopy || LucideIcons.Book };
    const LucideIcon = AllIcons[name];
    if (!LucideIcon) {
        return <LucideIcons.HelpCircle {...props} />; // Fallback icon
    }
    return <LucideIcon {...props} />;
};

export default Icon;
