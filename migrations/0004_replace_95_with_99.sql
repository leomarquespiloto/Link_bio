UPDATE site_links
SET
  title = REPLACE(title, '95', '99'),
  description = REPLACE(description, '95', '99'),
  href = REPLACE(href, '95', '99'),
  image = REPLACE(image, '95', '99')
WHERE
  instr(title, '95') > 0 OR
  instr(description, '95') > 0 OR
  instr(href, '95') > 0 OR
  instr(image, '95') > 0;
