const customVerticalMenuData = dictionary => [

  // This is how you will normally render submenu
  {
    label: dictionary['navigation'].dashboard,
    icon: 'tabler-smart-home',
    href: '/branch/dashboard'
  },
  {
    label: 'Users',
    icon: 'tabler-user',
    children: [
      {
        label: dictionary['navigation'].list,
        icon: 'tabler-circle',
        href: '/branch/user/list'
      },
      {
        label: dictionary['navigation'].add,
        icon: 'tabler-circle',
        href: '/branch/user/add'
      }
    ]
  },
  {
    label: 'Jobs',
    icon: 'tabler-briefcase',
    href: '/branch/jobs'
  }
]

export default customVerticalMenuData
