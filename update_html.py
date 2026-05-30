import re

with open('/Users/zeifurrohman/Downloads/Zeifur Rohman Personal Web/index.html', 'r') as f:
    content = f.read()

# 1. About bullets -> remove them
about_pattern = r'<ul class="bullets">.*?</ul>'
content = re.sub(about_pattern, '', content, flags=re.DOTALL)

# 2. Update Stats labels
stats_pattern = r'<div class="stat-item"><h3 class="stat-number">145</h3><p class="stat-label" data-translate="about_stats_projects">PROYEK SELESAI</p></div>\s*<div class="stat-item"><h3 class="stat-number">357</h3><p class="stat-label" data-translate="about_stats_customers">KLIEN PUAS</p></div>'
new_stats = """<div class="stat-item"><h3 class="stat-number">12</h3><p class="stat-label" data-translate="about_stats_projects">PROYEK SELESAI</p></div>
                        <div class="stat-item"><h3 class="stat-number">12</h3><p class="stat-label" data-translate="about_stats_customers">KLIEN PUAS</p></div>
                        <div class="stat-item"><h3 class="stat-number">380</h3><p class="stat-label" data-translate="about_stats_hours">JAM KERJA</p></div>
                        <div class="stat-item"><h3 class="stat-number">3</h3><p class="stat-label" data-translate="about_stats_certs">SERTIFIKASI PROFESIONAL</p></div>"""
content = re.sub(stats_pattern, new_stats, content)

# 3. Update Portfolio items
# First item
port1 = r'<div class="port-item website" data-category="website">\s*<img src="assets/images/webdev.png" alt="Web Project">\s*<div class="port-overlay"><span data-translate="portfolio_item_web_cat">WEBSITE</span><h3 data-translate="portfolio_item_web_title">PLATFORM AGENSI</h3></div>\s*</div>'
new_port1 = """<div class="port-item website" data-category="website">
                            <img src="assets/images/webdev.png" alt="Web Project">
                            <div class="port-overlay">
                                <span data-translate="portfolio_item_web_cat">WEBSITE</span>
                                <h3 data-translate="portfolio_item_web_title">PLATFORM AGENSI</h3>
                                <p class="port-desc" data-translate="portfolio_item_web_desc"></p>
                            </div>
                        </div>"""
content = re.sub(port1, new_port1, content)

# Second item
port2 = r'<div class="port-item branding" data-category="branding">\s*<img src="assets/images/branding.png" alt="Branding Project">\s*<div class="port-overlay"><span data-translate="portfolio_item_brand_cat">BRANDING</span><h3 data-translate="portfolio_item_brand_title">IDENTITAS MEWAH</h3></div>\s*</div>'
new_port2 = """<div class="port-item branding" data-category="branding">
                            <img src="assets/images/branding.png" alt="Branding Project">
                            <div class="port-overlay">
                                <span data-translate="portfolio_item_brand_cat">BRANDING</span>
                                <h3 data-translate="portfolio_item_brand_title">PESONA CUPANG MALANG</h3>
                                <p class="port-desc" data-translate="portfolio_item_brand_desc"></p>
                            </div>
                        </div>"""
content = re.sub(port2, new_port2, content)

# Third item
port3 = r'<div class="port-item photography" data-category="photography">\s*<img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d\?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Photography">\s*<div class="port-overlay"><span data-translate="portfolio_item_photo_cat">FOTOGRAFI</span><h3 data-translate="portfolio_item_photo_title">KEHIDUPAN KOTA</h3></div>\s*</div>'
new_port3 = """<div class="port-item photography" data-category="photography">
                            <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Photography">
                            <div class="port-overlay">
                                <span data-translate="portfolio_item_photo_cat">FOTOGRAFI</span>
                                <h3 data-translate="portfolio_item_photo_title">GRADUATION CONCEPT</h3>
                                <p class="port-desc" data-translate="portfolio_item_photo_desc"></p>
                            </div>
                        </div>"""
content = re.sub(port3, new_port3, content)

# Fourth item (change to photography based on user text "04. Sports Photography")
port4 = r'<div class="port-item branding" data-category="branding">\s*<img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302\?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Branding">\s*<div class="port-overlay"><span data-translate="portfolio_item_brand_cat2">BRANDING</span><h3 data-translate="portfolio_item_brand_title2">KEMASAN MINIMALIS</h3></div>\s*</div>'
new_port4 = """<div class="port-item photography" data-category="photography">
                            <img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Sports Photography">
                            <div class="port-overlay">
                                <span data-translate="portfolio_item_brand_cat2">FOTOGRAFI</span>
                                <h3 data-translate="portfolio_item_brand_title2">SPORTS ACTION</h3>
                                <p class="port-desc" data-translate="portfolio_item_brand_desc2"></p>
                            </div>
                        </div>
                        <div class="port-item photography" data-category="photography">
                            <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Event Documentation">
                            <div class="port-overlay">
                                <span data-translate="portfolio_item_photo_cat3">FOTOGRAFI</span>
                                <h3 data-translate="portfolio_item_photo_title3">EVENT DOCUMENTATION</h3>
                                <p class="port-desc" data-translate="portfolio_item_photo_desc3"></p>
                            </div>
                        </div>"""
content = re.sub(port4, new_port4, content)

# 4. Update Footer Contact
footer_contact = r'<a href="https://wa.me/6287860009497" target="_blank">\+62 878 6000 9497</a>'
content = content.replace(footer_contact, '<a href="https://wa.me/6285965999035" target="_blank">085965999035</a>')
content = content.replace('href="https://wa.me/6287860009497"', 'href="https://wa.me/6285965999035"')


with open('/Users/zeifurrohman/Downloads/Zeifur Rohman Personal Web/index.html', 'w') as f:
    f.write(content)
