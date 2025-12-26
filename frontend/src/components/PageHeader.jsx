import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function PageHeader({ 
  title, 
  subtitle, 
  breadcrumbs, 
  actions,
  icon: Icon 
}) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={16} className="text-gray-400" />}
                <a 
                  href={crumb.path} 
                  className={`${
                    idx === breadcrumbs.length - 1
                      ? 'text-gray-900 font-semibold'
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  {crumb.label}
                </a>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Header Content */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {Icon && (
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon size={28} className="text-blue-600" />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          {actions && actions.length > 0 && (
            <div className="flex gap-3 flex-wrap justify-end">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all ${
                    action.variant === 'secondary'
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {action.icon && <action.icon size={20} />}
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
