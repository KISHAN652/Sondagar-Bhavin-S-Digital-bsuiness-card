# NFC Usage Guide

This guide explains how to use NFC (Near Field Communication) with your Digital Business Card.

## What is NFC?

NFC allows devices to communicate wirelessly over short distances (typically 4cm or less). You can write your card URL to an NFC tag, and when someone taps their phone to the tag, it opens your digital business card.

---

## Supported Devices

### ✅ Android
- **Android 5.0+** with NFC hardware
- **Chrome browser** (recommended)
- Most modern Android phones have NFC

### ✅ iOS
- **iOS 13+** (iPhone 7 and newer)
- **Safari browser**
- NFC reading is automatic (no app needed)
- NFC writing requires third-party apps

---

## Part 1: Buy NFC Tags

### Recommended NFC Tags

1. **NTAG215** - Most compatible
   - 540 bytes memory
   - Works with all phones
   - ~$0.50 per tag

2. **NTAG216** - More memory
   - 924 bytes memory
   - Good for longer URLs
   - ~$0.70 per tag

### Where to Buy

- Amazon: Search "NTAG215 NFC tags"
- AliExpress: Bulk orders
- Local electronics stores

### Tag Formats

- **Stickers** - Stick on business cards
- **Cards** - Credit card size
- **Keychains** - Portable
- **Wristbands** - Wearable

---

## Part 2: Writing NFC Tags (Android)

### Method 1: Using the Web App (Chrome)

1. Open your card in Chrome:
   ```
   https://your-app.com/card/YOUR_CARD_ID
   ```

2. Tap the **NFC button** at the bottom

3. Hold your phone near the NFC tag

4. Wait for confirmation: "✓ NFC tag written successfully!"

### Method 2: Using NFC Tools App

1. Download **NFC Tools** from Play Store

2. Open the app → **Write** tab

3. Click **Add a record** → **URL/URI**

4. Enter your card URL:
   ```
   https://your-app.com/card/YOUR_CARD_ID
   ```

5. Click **OK** → **Write**

6. Hold phone near NFC tag

---

## Part 3: Writing NFC Tags (iOS)

### Using NFC Tools App

1. Download **NFC Tools** from App Store

2. Open app → **Write** tab

3. Tap **Add a record** → **URL/URI**

4. Enter your card URL

5. Tap **Write** → **Ready to scan**

6. Hold iPhone near NFC tag (top edge)

### Using Shortcuts App (iOS 13+)

1. Open **Shortcuts** app

2. Create new shortcut:
   - Add action: **Text**
   - Enter your card URL
   - Add action: **Encode [Text] to NFC Tag**

3. Run shortcut

4. Hold iPhone near tag

---

## Part 4: Reading NFC Tags

### Android

1. **Enable NFC:**
   - Settings → Connected devices → Connection preferences
   - Turn on **NFC**

2. **Read tag:**
   - Unlock phone
   - Hold phone near tag
   - Card opens automatically in browser

### iOS

1. **NFC is always on** (iOS 13+)

2. **Read tag:**
   - Unlock phone
   - Hold top edge of iPhone near tag
   - Tap notification to open card

---

## Part 5: Best Practices

### Tag Placement

✅ **Good locations:**
- Back of physical business card
- Inside phone case
- On desk nameplate
- On product packaging
- On event badges

❌ **Avoid:**
- Metal surfaces (blocks NFC)
- Near magnets
- Thick materials (reduces range)

### Testing

1. Write tag
2. Test with multiple phones
3. Verify URL opens correctly
4. Check analytics to confirm tracking

### Security

- NFC tags can be overwritten
- Use **lock** feature to prevent changes
- In NFC Tools: Write → Options → Lock tag

⚠️ **Warning:** Locking is permanent!

---

## Part 6: Troubleshooting

### Tag Not Detected

**Android:**
- Enable NFC in settings
- Remove phone case (if thick)
- Try different position
- Restart phone

**iOS:**
- Update to iOS 13+
- Hold top edge near tag
- Ensure phone is unlocked
- Try different angle

### Wrong URL Opens

- Tag was overwritten
- Rewrite with correct URL
- Lock tag to prevent changes

### Tag Works on Android, Not iOS

- iOS requires NDEF format
- Reformat tag using NFC Tools
- Ensure URL starts with `https://`

### Short Read Range

- Tag might be damaged
- Try new tag
- Ensure no metal nearby
- Remove thick phone case

---

## Part 7: Advanced Features

### Dynamic NFC (Coming Soon)

Instead of writing URL directly, write a redirect URL:
```
https://your-app.com/nfc/TAG_ID
```

Benefits:
- Change destination without rewriting tag
- Track individual tag analytics
- A/B test different cards

### Multiple Cards on One Tag

Write multiple URLs:
1. Primary card URL
2. Backup URL
3. vCard download link

User can choose which to open.

---

## Part 8: Analytics

### Track NFC Taps

When someone taps your NFC tag:
1. URL opens in browser
2. Card page loads
3. Analytics automatically tracked
4. View in Admin Panel → Analytics

### Metrics Available

- Total taps
- Device type (mobile/desktop)
- Timestamp
- Location (if enabled)

---

## Part 9: Creative Uses

### Business Cards
- Embed in physical card
- Instant contact sharing
- No app required

### Networking Events
- Badge with NFC
- Quick profile sharing
- Lead capture

### Product Packaging
- Product information
- User manuals
- Support contact

### Real Estate
- Property details
- Virtual tours
- Agent contact

### Restaurants
- Digital menu
- Ordering system
- Feedback form

---

## Part 10: Cost Analysis

### Initial Investment

| Item | Quantity | Cost |
|------|----------|------|
| NTAG215 tags | 100 | $50 |
| NFC Tools app | 1 | Free |
| **Total** | | **$50** |

### Per Card Cost

- NFC tag: $0.50
- Printing: $0.20
- Total: **$0.70 per card**

Compare to:
- Traditional business cards: $0.05
- Smart business cards: $5-10

---

## Resources

### Apps

**Android:**
- NFC Tools (Free)
- NFC TagWriter (Free)
- Trigger (Automation)

**iOS:**
- NFC Tools (Free)
- NFC for iPhone (Free)
- Shortcuts (Built-in)

### Websites

- [NFC Forum](https://nfc-forum.org/)
- [NFC Tools Online](https://www.wakdev.com/en/)
- [NDEF Format Spec](https://nfc-forum.org/our-work/specifications-and-application-documents/)

### Videos

- Search YouTube: "How to write NFC tags"
- Search YouTube: "NFC business card tutorial"

---

## FAQ

**Q: Can I rewrite NFC tags?**  
A: Yes, unless locked. Most tags can be rewritten 100,000+ times.

**Q: Do NFC tags need power?**  
A: No, they're passive. Phone provides power.

**Q: What's the read range?**  
A: Typically 1-4cm. Depends on phone and tag.

**Q: Can I use NFC with a phone case?**  
A: Yes, unless case is very thick or metal.

**Q: Are NFC tags waterproof?**  
A: Depends on tag. Most stickers are water-resistant.

**Q: How long do NFC tags last?**  
A: 10+ years with proper care.

**Q: Can I track who taps my NFC tag?**  
A: You can track taps, but not identify individuals (privacy).

---

**Ready to go NFC? Order your tags and start sharing! 🚀**
