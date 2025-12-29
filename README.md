# 🎂 Ishan's Birthday Invitations

A collection of birthday party invitations for Ishan, one for each year!

## 📝 Adding a New Year

1. Create a new folder:
   ```bash
   mkdir 3rd
   ```

2. Copy `index.html` and `config.js` from previous year:
   ```bash
   cp 2nd/index.html 3rd/
   cp 2nd/config.js 3rd/
   cp 2nd/favicon.svg 3rd/
   ```

3. Update `3rd/config.js` with new dates and age:
   ```javascript
   const CONFIG = {
       child: {
           name: 'ISHAN',
           age: 3,
           ageText: 'TRES',
       },
       dates: {
           birthdayMoment: new Date('2026-12-31T12:38:00'),
           partyStart: new Date('2027-01-XX...'),
           partyEnd: new Date('2027-01-XX...'),
       },
       ordinal: 'tercer',
       // ... update venue, partyTime as needed
   };
   ```

4. Update root `index.html` redirect

## 🧪 Local Preview

```bash
python3 -m http.server 3000
# Open http://localhost:3000
```
