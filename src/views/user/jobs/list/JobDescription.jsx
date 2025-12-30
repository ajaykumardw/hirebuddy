// 'use client';
// import { Typography } from '@mui/material';

// const JobDescription = ({ html }) => {
//   return (
//     <Typography
//       variant="body1"
//       className="overflow-hidden whitespace-nowrap text-ellipsis"
//       dangerouslySetInnerHTML={{ __html: html }}
//     />
//   );
// };

// export default JobDescription;

'use client';
import { Typography } from '@mui/material';

const parseHtmlToSingleLine = (html) => {
  if (typeof window === 'undefined') return '';

  const container = document.createElement('div');

  container.innerHTML = html;

  let result = '';
  let counter = 1;

  for (const child of container.childNodes) {
    if (child.nodeName === 'OL') {
      for (const li of child.childNodes) {
        if (li.textContent.trim()) {
          result += `${counter++}. ${li.textContent.trim()} `;
        }
      }
    } else {
      result += `${child.textContent.trim()} `;
    }
  }

  return result.replace(/\s+/g, ' ').trim();
};

const JobDescription = ({ html, full }) => {
  const text = parseHtmlToSingleLine(html);

  if(full){
    return (
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <Typography
      variant="body1"
      noWrap
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%',
      }}
    >
      {text}
    </Typography>
  );
};

export default JobDescription;

