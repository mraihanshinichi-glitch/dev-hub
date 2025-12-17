# Keyboard Shortcuts - DevHub

## ⌨️ Feature Keyboard Shortcuts Added

### 🎯 **New: Feature Status Shortcuts**
Menambahkan keyboard shortcuts untuk mengubah status feature, sama seperti yang sudah ada di releases.

## 🔧 Implementation Details

### **Hook: `useFeatureShortcuts`**
```typescript
// lib/hooks/use-keyboard-shortcuts.ts
export function useFeatureShortcuts(
  onStatusChange: (status: string) => void,
  currentStatus: string,
  enabled = true
) {
  const shortcuts: KeyboardShortcut[] = [
    { key: '1', callback: () => onStatusChange('planned') },
    { key: '2', callback: () => onStatusChange('in-progress') },
    { key: '3', callback: () => onStatusChange('done') },
    { key: 'ArrowLeft', callback: () => /* previous status */ },
    { key: 'ArrowRight', callback: () => /* next status */ }
  ]
}
```

### **Feature Card Updates**
```typescript
// components/project/feature-card.tsx
const [isFocused, setIsFocused] = useState(false)

// Enable keyboard shortcuts when card is focused
useFeatureShortcuts(handleStatusChange, feature.status, isFocused)

// Card with focus support
<Card 
  className={`feature-card ${isFocused ? 'ring-2 ring-primary/50' : ''}`}
  tabIndex={0}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  onClick={() => setIsFocused(true)}
>
```

## ⌨️ Available Shortcuts

### **Feature Status Shortcuts**
| Key | Action | Status |
|-----|--------|--------|
| `1` | Set to Planned | 🔵 Direncanakan |
| `2` | Set to In Progress | 🟡 Sedang Dikerjakan |
| `3` | Set to Done | 🟢 Selesai |
| `←` | Previous Status | Cycle backward |
| `→` | Next Status | Cycle forward |

### **Release Status Shortcuts** (Existing)
| Key | Action | Status |
|-----|--------|--------|
| `1` | Set to Planned | 🔵 Direncanakan |
| `2` | Set to Upcoming | 🟡 Akan Datang |
| `3` | Set to Released | 🟢 Dirilis |
| `←` | Previous Status | Cycle backward |
| `→` | Next Status | Cycle forward |

## 🎨 Visual Feedback

### **Focus Indicators**
- **Ring Border**: `ring-2 ring-primary/50` when focused
- **Border Color**: `border-primary/50` when focused
- **Cursor**: `cursor-pointer` for clickable cards

### **Keyboard Shortcuts Hint**
```jsx
{isFocused && (
  <div className="flex items-center gap-2 text-xs text-app-text-muted">
    <span className="bg-gray-800 px-1.5 py-0.5 rounded">←→</span>
    <span className="bg-gray-800 px-1.5 py-0.5 rounded">1-3</span>
    <span>untuk ubah status</span>
  </div>
)}
```

## 🔄 Status Flow

### **Feature Status Flow**
```
Planned → In Progress → Done
   ↑                     ↓
   ←←←←←←←←←←←←←←←←←←←←←←←←←
```

### **Release Status Flow**
```
Planned → Upcoming → Released
   ↑                    ↓
   ←←←←←←←←←←←←←←←←←←←←←←←
```

## 🎯 User Experience

### **How to Use**
1. **Click** on a feature card to focus it
2. **Press number keys** (1-3) for direct status change
3. **Use arrow keys** (←→) to cycle through statuses
4. **Visual hint** appears when card is focused
5. **Ring border** indicates focused card

### **Benefits**
- ✅ **Faster Workflow**: No need to click dropdown menus
- ✅ **Keyboard Navigation**: Efficient for power users
- ✅ **Consistent UX**: Same shortcuts for features and releases
- ✅ **Visual Feedback**: Clear indication of focused card
- ✅ **Accessibility**: Proper focus management

## 🔧 Technical Implementation

### **Focus Management**
```typescript
const [isFocused, setIsFocused] = useState(false)

// Focus handlers
onFocus={() => setIsFocused(true)}
onBlur={() => setIsFocused(false)}
onClick={() => setIsFocused(true)}
```

### **Keyboard Event Handling**
```typescript
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    const shortcut = shortcuts.find(s => 
      s.key.toLowerCase() === event.key.toLowerCase()
    )
    if (shortcut) {
      event.preventDefault()
      shortcut.callback()
    }
  }
  
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [shortcuts, enabled])
```

### **Status Cycling Logic**
```typescript
// Arrow Left: Previous Status
const statuses = ['planned', 'in-progress', 'done']
const currentIndex = statuses.indexOf(currentStatus)
const prevIndex = currentIndex > 0 ? currentIndex - 1 : statuses.length - 1

// Arrow Right: Next Status  
const nextIndex = currentIndex < statuses.length - 1 ? currentIndex + 1 : 0
```

## 🎨 Styling

### **Focus Ring**
```css
.ring-2.ring-primary\/50 {
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.5);
}
```

### **Keyboard Hint Badges**
```css
.bg-gray-800.px-1\.5.py-0\.5.rounded {
  background-color: #1f2937;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}
```

## 🧪 Testing

### **Manual Testing**
- [ ] Click feature card → should show focus ring
- [ ] Press `1` → should change to "Planned"
- [ ] Press `2` → should change to "In Progress"  
- [ ] Press `3` → should change to "Done"
- [ ] Press `←` → should cycle to previous status
- [ ] Press `→` → should cycle to next status
- [ ] Click outside → should remove focus ring
- [ ] Keyboard hint should appear when focused

### **Edge Cases**
- [ ] Multiple cards focused → only one should respond
- [ ] Rapid key presses → should handle gracefully
- [ ] Status update errors → should show error toast
- [ ] Card unmounted while focused → should cleanup listeners

## 🔮 Future Enhancements

### **Potential Additions**
- [ ] **Global Shortcuts**: Ctrl+1/2/3 for quick status changes
- [ ] **Bulk Operations**: Select multiple cards with Shift+Click
- [ ] **Custom Shortcuts**: User-configurable key bindings
- [ ] **Shortcut Help**: Modal with all available shortcuts
- [ ] **Navigation**: Tab/Shift+Tab to move between cards

### **Accessibility Improvements**
- [ ] **Screen Reader**: Announce status changes
- [ ] **High Contrast**: Better focus indicators
- [ ] **Reduced Motion**: Respect user preferences
- [ ] **Keyboard Only**: Full navigation without mouse

Feature keyboard shortcuts successfully implemented with consistent UX across features and releases! ⌨️🎉