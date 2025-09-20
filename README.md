# Aegis Tutoring Website

A professional website for Aegis Tutoring, featuring responsive design and Netlify form integration.

## Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional design inspired by Aegis Management
- **Interactive Elements**: Smooth scrolling, hover effects, and animations
- **Form Integration**: Contact form with Netlify integration for email notifications
- **Multiple Pages**: Home, Services, About Us, Testimonials, and Contact pages

## Pages

1. **Home Page**: Hero section with call-to-action, score guarantee, video, and company description
2. **Services Page**: Comprehensive list of tutoring services with consultation booking
3. **About Us Page**: Lead tutors and team member profiles
4. **Testimonials Page**: Scrolling testimonials from satisfied students
5. **Contact Us Page**: Contact form with Netlify integration

## Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- JavaScript (ES6+)
- Google Fonts (Inter)
- Netlify Forms

## Deployment to Netlify

### Method 1: Drag and Drop
1. Zip the entire project folder
2. Go to [Netlify](https://netlify.com)
3. Drag and drop the zip file to deploy

### Method 2: Git Integration
1. Push the code to a GitHub repository
2. Connect the repository to Netlify
3. Deploy automatically on every push

### Method 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir .
```

## Form Configuration

The contact form is configured to work with Netlify Forms:

1. The form has `data-netlify="true"` attribute
2. Includes honeypot field for spam protection
3. Form submissions will appear in your Netlify dashboard
4. You can set up email notifications in Netlify settings

## Customization

### Colors
The main color scheme can be modified in `styles.css`:
- Primary Blue: `#2c5aa0`
- Dark Blue: `#1e3a5f`
- Orange CTA: `#ff6b35`

### Content
- Update tutor information in `about.html`
- Modify services in `services.html`
- Add/remove testimonials in `testimonials.html`
- Update contact information in `contact.html`

### Images
Replace placeholder content with actual images:
- Hero background image
- Tutor photos
- Company logo

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Optimized CSS and JavaScript
- Responsive images
- Fast loading times
- Mobile-first design approach

## License

© 2024 Aegis Tutoring. All rights reserved.
