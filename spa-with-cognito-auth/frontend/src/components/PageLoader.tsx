import {
  AppShell,
  Container,
  createStyles,
  Header as BaseHeader,
  Skeleton,
} from '@mantine/core';

const useStyles = createStyles(() => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
}));

const Header = () => {
  const { classes } = useStyles();

  return (
    <BaseHeader height={60}>
      <Container className={classes.header}>
        <Skeleton animate={false} height={8} width={100} />
        <Skeleton animate={false} height={8} width={100} />
      </Container>
    </BaseHeader>
  );
};

export function PageLoader() {
  return (
    <AppShell padding="md" header={<Header />}>
      <Container>
        <Skeleton visible mt={20}>
          <br />
          <br />
        </Skeleton>
      </Container>
    </AppShell>
  );
}
