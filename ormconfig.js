module.exports = {
  // other TypeORM configuration properties...
  entities: ['dist/**/**.entity{.ts,.js}'],
  synchronise: true,
  cli: {
    entitiesDir: 'src/entitties',
  },
};
