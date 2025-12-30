const userVerticalMenuData = dictionary => [

  // This is how you will normally render submenu
  {
    label: 'Dashboard',
    icon: 'tabler-smart-home',
    href: '/dashboard'
  },
  {
    label: 'Candidates',
    icon: 'tabler-user',
    children: [
      {
        label: 'List',
        icon: 'tabler-circle',
        href: '/candidates/list'
      },
      {
        label: 'Add',
        icon: 'tabler-circle',
        href: '/candidates/add'
      },
      {
        label: 'Upload',
        icon: 'tabler-circle',
        href: '/candidates/upload'
      }
    ]
  },
  {
    label: 'Jobs',
    icon: 'tabler-briefcase',
    children: [
      {
        label: 'View Jobs',
        icon: 'tabler-circle',
        href: '/jobs/list'
      },

      // {
      //   label: 'Add',
      //   icon: 'tabler-circle',
      //   href: '/jobs/add'
      // }

    ]
  },
  {
    label: 'Email Templates',
    icon: 'tabler-mail',
    href: '/job-email-templates'
  },

  // {
  //   label: 'Reports',
  //   icon: 'tabler-report',
  //   children: [
  //     {
  //       label: 'Movement Report (MR)',
  //       icon: 'tabler-circle',
  //       href: '/reports/movement-report'
  //     },
  //     {
  //       label: 'Night Allowance Journal (NDA)',
  //       icon: 'tabler-circle',
  //       href: '/reports/night-allowance-journal'
  //     },
  //     {
  //       label: 'Traveling Allowance Journal (TA)',
  //       icon: 'tabler-circle',
  //       href: '/reports/traveling-allowance-journal'
  //     }
  //   ]
  // }
]

export default userVerticalMenuData
