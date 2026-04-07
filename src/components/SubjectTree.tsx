"use client";

import { useState } from "react";

export interface Subject {
  id: number;
  name: string;
  children: Subject[];
}

interface SubjectTreeProps {
  subjects: Subject[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

interface SubjectNodeProps {
  subject: Subject;
  level: number;
  selectedIds: number[];
  onToggle: (id: number) => void;
}

function SubjectNode({ subject, level, selectedIds, onToggle }: SubjectNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = subject.children.length > 0;
  const isSelected = selectedIds.includes(subject.id);
  const isTopLevel = level === 0;
  const isSelectable = !isTopLevel || !hasChildren;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-md transition-colors"
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-emerald-100 rounded transition-colors text-emerald-600 font-bold text-xs"
            title={isExpanded ? "Collapse" : "Expand to see more"}
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        ) : (
          <div className="w-5" />
        )}
        
        <button
          type="button"
          onClick={() => isSelectable && onToggle(subject.id)}
          disabled={!isSelectable}
          className={`flex-1 text-left px-3 py-2 rounded-md text-sm font-medium transition-all ${
            !isSelectable
              ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
              : isSelected
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-300 hover:border-emerald-400 hover:shadow-sm"
          }`}
        >
          <span className="flex items-center justify-between">
            {subject.name}
            {hasChildren && (
              <span className="text-xs opacity-60 ml-2">({subject.children.length})</span>
            )}
          </span>
        </button>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {subject.children.map((child) => (
            <SubjectNode
              key={child.id}
              subject={child}
              level={level + 1}
              selectedIds={selectedIds}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SubjectTree({
  subjects,
  selectedIds,
  onSelectionChange,
}: SubjectTreeProps) {
  const handleToggle = (id: number) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];
    onSelectionChange(newSelection);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-2 max-h-96 overflow-y-auto bg-white">
      <div className="text-xs text-gray-500 mb-2 px-3 py-1 bg-gray-50 rounded">
        💡 Click ▶ to expand categories, then select specific subjects
      </div>
      {subjects.map((subject) => (
        <SubjectNode
          key={subject.id}
          subject={subject}
          level={0}
          selectedIds={selectedIds}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
}
