# 🎂 Ishan's Birthday Invitations

A collection of birthday party invitations for Ishan, one for each year!


## 🔄 Switching Years

To point to a new birthday, edit the root `index.html` and change:

```html
<meta http-equiv="refresh" content="0; url=./2nd/">
```

to:

```html
<meta http-equiv="refresh" content="0; url=./3rd/">
```

### Local Preview

```bash
python3 -m http.server 3000
# Open http://localhost:3000
```

## 📝 Adding a New Year

1. Copy the previous year's folder:
   ```bash
   cp -r 2nd/ 3rd/
   ```
2. Update the content in the new folder
3. Change the root `index.html` redirect
4. Update this README
