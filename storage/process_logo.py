from PIL import Image

img = Image.open('/home/webapps.ee/bgc.webapps.ee/public/images/bgc-logo-raw.png').convert('RGBA')
datas = img.getdata()

new_data = []
for item in datas:
    # If pixel is near white (R, G, B > 240)
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        new_data.append((255, 255, 255, 0))  # Fully transparent
    else:
        new_data.append(item)

img.putdata(new_data)

# Auto-crop to bounding box of emblem
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# Add 4% padding
pad = max(12, int(max(img.size) * 0.04))
padded_size = (img.width + pad * 2, img.height + pad * 2)
final_img = Image.new('RGBA', padded_size, (0, 0, 0, 0))
final_img.paste(img, (pad, pad), img)

# Save high-res transparent PNG
final_img.save('/home/webapps.ee/bgc.webapps.ee/public/images/bgc-logo.png', format='PNG')
final_img.save('/home/webapps.ee/bgc.webapps.ee/public/favicon.png', format='PNG')
final_img.save('/home/webapps.ee/bgc.webapps.ee/storage/app/public/logos/Dcah7g4rYI5qpB4dS6MZ9opkqXQjExslbNlG0xhO.png', format='PNG')

# Multi-size ICO
icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
final_img.save('/home/webapps.ee/bgc.webapps.ee/public/favicon.ico', format='ICO', sizes=icon_sizes)

# White-padded JPEG fallback
white_bg = Image.new('RGB', final_img.size, (255, 255, 255))
white_bg.paste(final_img, (0, 0), final_img)
white_bg.save('/home/webapps.ee/bgc.webapps.ee/storage/app/public/logos/Dcah7g4rYI5qpB4dS6MZ9opkqXQjExslbNlG0xhO.jpg', format='JPEG', quality=95)

print('Success: Pure PIL logo & favicon processing complete! Output size:', final_img.size)
