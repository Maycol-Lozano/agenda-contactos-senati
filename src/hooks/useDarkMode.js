<<<<<<< HEAD
import { useState, useEffect } from 'react';

export function useDarkMode() {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleDarkMode = () => setIsDark((prev) => !prev);

    return [isDark, toggleDarkMode];
=======
import { useState, useEffect } from 'react';

export function useDarkMode() {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleDarkMode = () => setIsDark((prev) => !prev);

    return [isDark, toggleDarkMode];
>>>>>>> fefcd915a1f91e61a6530f29a0649b35d94de09f
}