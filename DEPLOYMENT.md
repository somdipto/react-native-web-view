# 🚀 Deployment Guide

## Deploy to Vercel (Recommended)

### Method 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/somdipto/react-native-web-view)

### Method 2: Manual Deployment

1. **Fork the Repository**
   - Go to [github.com/somdipto/react-native-web-view](https://github.com/somdipto/react-native-web-view)
   - Click "Fork" to create your own copy

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your forked repository

3. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Method 3: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Clone and setup
git clone https://github.com/somdipto/react-native-web-view.git
cd react-native-web-view
npm install

# Deploy
vercel --prod
```

## Deploy to Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select the repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **Deploy**
   - Click "Deploy site"
   - Your app will be live at `https://your-site-name.netlify.app`

## Deploy to GitHub Pages

1. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: "GitHub Actions"

2. **Create Workflow**
   - The `.github/workflows/deploy.yml` is already included
   - Push to main branch to trigger deployment

3. **Access**
   - Your app will be live at `https://somdipto.github.io/react-native-web-view`

## Environment Variables

No environment variables are required for basic deployment. The app works out of the box!

## Build Optimization

The project is already optimized for production with:

- ✅ Code splitting
- ✅ Asset optimization
- ✅ Gzip compression
- ✅ Tree shaking
- ✅ Minification

## Custom Domain

### Vercel
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS records as shown

### Netlify
1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Ensure Node.js version is 16+
- Clear cache: `npm ci`
- Check build logs for specific errors

### Preview Not Working
- Check browser console for errors
- Ensure JavaScript is enabled
- Try different browsers

### Performance Issues
- Enable gzip compression on your hosting
- Use CDN for static assets
- Monitor bundle size

## Support

If you encounter any deployment issues:

1. Check the [Issues](https://github.com/somdipto/react-native-web-view/issues) page
2. Create a new issue with deployment details
3. Include error logs and environment info

---

**Happy Deploying! 🎉**
