# LEGACY CODE ARCHIVE

This directory contains old, deprecated, or replaced code that has been **completely neutralized** and preserved for reference purposes only.

## ⚠️ IMPORTANT: DO NOT USE THESE FILES

- These files are **NOT imported** anywhere in the active codebase
- They are **completely neutralized** and cannot affect running code
- They are preserved **ONLY for historical reference** and debugging
- **DO NOT** import, reference, or call these files in active development

## 📁 Files in This Archive

### `lexintelCSEBridge.ts` (DEPRECATED)
- **Replaced by**: `src/lib/lexintelImages.ts`
- **Reason**: New implementation provides better performance and reliability
- **Status**: Completely neutralized, no exports available

### `cse-images-only.html` (DEPRECATED)
- **Replaced by**: Direct integration in `FreeResearchPane.tsx`
- **Reason**: Simplified architecture, no need for separate iframe
- **Status**: Completely neutralized, no references in active code

## 🔒 How Neutralization Works

1. **No exports**: All functions are commented out or removed
2. **No imports**: No active code references these files
3. **No side effects**: Files cannot execute or modify application state
4. **Documentation only**: Preserved for understanding previous implementations

## 📚 When to Reference Legacy Code

- **Debugging**: Understanding why a previous approach didn't work
- **Architecture**: Learning from past design decisions
- **Migration**: Understanding what changed and why
- **Documentation**: Historical context for development decisions

## 🚫 What NOT to Do

- ❌ Import legacy files into active components
- ❌ Copy-paste legacy code into new implementations
- ❌ Use legacy files as templates for new features
- ❌ Reference legacy files in production builds

## ✅ What TO Do

- ✅ Use the new, active implementations
- ✅ Reference legacy code only for understanding
- ✅ Document any important learnings from legacy code
- ✅ Remove legacy files when no longer needed for reference

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd")
**Reason for Archive**: Google CSE implementation refactor for better performance
