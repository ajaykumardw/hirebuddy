const candidateMenuData = dictionary => [

  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboard,
    icon: 'tabler-smart-home',
    href: '/candidate/dashboard'
  },
  {
    label: 'Jobs',
    icon: 'tabler-briefcase',
    children: [
      {
        label: 'View Jobs',
        icon: 'tabler-circle',
        href: '/candidate/jobs/list'
      },
      {
        label: 'Applied',
        icon: 'tabler-circle',
        href: '/candidate/jobs/applied'
      }
    ]
  }
]

export default candidateMenuData
