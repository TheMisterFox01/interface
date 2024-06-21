import { useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'

const TableHead = ({ children }: { children: JSX.Element }) => {
  const theme = useTheme()
  const isPhone = useMediaQuery(theme.breakpoints.between('xs', 1280))

  return isPhone === false ? (
    <thead>
      {children}
    </thead>
  ) : <></>
}

export default TableHead
