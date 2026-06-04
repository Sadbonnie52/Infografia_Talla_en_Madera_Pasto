import React from 'react';

export const OrganicDefs: React.FC<{ idPrefix: string, color?: string, opacity?: number }> = ({ idPrefix, color = '#000000', opacity = 0.2 }) => (
    <defs>
        <pattern id={`${idPrefix}-pattern`} width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="scale(0.8) rotate(15)">
            <path d="M 30 0 C 40 15, 45 20, 60 30 C 45 40, 40 45, 30 60 C 20 45, 15 40, 0 30 C 15 20, 20 15, 30 0 Z" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity={opacity}/>
            <circle cx="30" cy="30" r="16" fill="none" stroke={color} strokeWidth="1" strokeOpacity={opacity}/>
            <circle cx="30" cy="30" r="24" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="2 2" strokeOpacity={opacity * 0.8}/>
            <circle cx="30" cy="30" r="4" fill={color} fillOpacity={opacity * 0.6}/>
        </pattern>
        <pattern id={`${idPrefix}-pattern-dense`} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="scale(0.6) rotate(45)">
            <path d="M 20 0 C 25 10, 30 15, 40 20 C 30 25, 25 30, 20 40 C 15 30, 10 25, 0 20 C 10 15, 15 10, 20 0 Z" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity={opacity}/>
            <circle cx="20" cy="20" r="8" fill="none" stroke={color} strokeWidth="1" strokeOpacity={opacity}/>
            <circle cx="20" cy="20" r="3" fill={color} fillOpacity={opacity * 0.4}/>
        </pattern>
    </defs>
);
