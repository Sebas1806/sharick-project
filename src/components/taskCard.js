// ============================================================
// taskCard.js — Renders a single Kanban task card
// Design is identical to the cards in board.html
// ============================================================

import { isAdmin, getSession } from '../auth.js';

/**
 * Status badge config
 */
const STATUS_BADGE = {
  'pending':     'bg-primary-fixed text-on-primary-fixed-variant',
  'todo':        'bg-primary-fixed text-on-primary-fixed-variant',
  'in progress': 'bg-primary-container text-on-primary',
  'in review':   'bg-primary-fixed text-on-primary-fixed-variant',
  'done':        'bg-secondary-container text-secondary',
};

/**
 * Generate the HTML for a task card
 * @param {Object} task - task data
 * @param {Object} assignedUser - user object (name, email)
 * @returns {string} HTML string
 */
export function createTaskCardHTML(task, assignedUser) {
  const session = getSession();
  const admin = isAdmin();
  const isOwner = session && task.userId === session.id;
  const canEdit = admin || isOwner;
  const isDone = task.status === 'done';
  const isInProgress = task.status === 'in progress';

  const userInitials = assignedUser
    ? assignedUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const doneStyles = isDone ? 'bg-surface/60 opacity-80' : 'bg-surface';
  const titleStyles = isDone ? 'line-through' : '';
  const inProgressBorder = isInProgress ? 'border-l-4 border-l-primary' : '';
  const statusLabel = task.status === 'pending' ? 'Pending' : capitalizeFirst(task.status);
  const checkIcon = isDone
    ? `<span class="material-symbols-outlined text-tertiary-container text-sm" style="font-variation-settings: 'FILL' 1">check_circle</span>`
    : '';

  const editButton = canEdit
    ? `<button
        class="edit-task-btn ml-auto text-on-surface-variant hover:text-primary transition-colors"
        data-task-id="${task.id}"
        title="Edit task">
        <span class="material-symbols-outlined text-[18px]">edit</span>
      </button>`
    : '';

  return `
    <div class="task-card ${doneStyles} ${inProgressBorder} border border-outline-variant rounded-xl p-md shadow-sm" data-task-id="${task.id}">
      <div class="flex items-start justify-between mb-xs">
        <span class="${STATUS_BADGE[task.status] || STATUS_BADGE['pending']} px-2 py-0.5 rounded-full font-label-sm text-label-sm">
          ${statusLabel}
        </span>
        ${checkIcon}
      </div>
      <h4 class="font-label-md text-label-md text-on-surface mb-xs ${titleStyles}">
        ${escapeHtml(task.title)}
      </h4>
      <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
        ${escapeHtml(task.description)}
      </p>
      <div class="mt-md flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-label-sm text-[10px] border-2 border-surface font-bold">
            ${userInitials}
          </div>
          <span class="font-body-sm text-body-sm text-on-surface-variant truncate max-w-[90px]">
            ${assignedUser ? escapeHtml(assignedUser.name) : 'Unassigned'}
          </span>
        </div>
        <div class="flex items-center gap-1">
          ${isDone
            ? `<span class="font-label-sm text-label-sm text-outline">Completed</span>`
            : `<span class="font-label-sm text-label-sm text-outline flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">schedule</span>
                Active
              </span>`
          }
          ${editButton}
        </div>
      </div>
    </div>
  `;
}

/** Capitalize first letter of a string */
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Escape HTML to prevent XSS */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str || ''));
  return div.innerHTML;
}
