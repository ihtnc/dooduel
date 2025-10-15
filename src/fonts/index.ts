import localFont from 'next/font/local';

export const PrimaryFont = localFont({
  src: [{
    path: './QuickPencilRegular-0R59.ttf',
    weight: '600',
    style: 'normal',
  }],
  variable: '--font-primary',
});
