-- Versões publicadas não podem ser alteradas nem apagadas (histórico imutável).
CREATE OR REPLACE FUNCTION config_version_immutable() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'ConfigVersion é imutável';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER config_version_no_update BEFORE UPDATE OR DELETE ON "ConfigVersion"
  FOR EACH ROW EXECUTE FUNCTION config_version_immutable();
