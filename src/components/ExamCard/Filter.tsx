import { Box, Chip, Option, Select, Stack, Typography } from '@mui/joy';
import { useTranslation } from 'react-i18next';

interface FilterProps<T, K extends keyof T> {
  placeholder: string;
  label: string;
  listObject?: T[];
  customList?: string[];
  filterThis?: K;
  onChange?: (selectedValues: string[]) => void;
}

const Filter = <T, K extends keyof T>({
  label,
  listObject,
  filterThis,
  placeholder,
  customList,
  onChange,
}: FilterProps<T, K>) => {
  const { t } = useTranslation();
  const uniqueValues = customList
    ? customList
    : [
        ...new Set(
          listObject?.map((obj) => obj[filterThis!] as T[K] & (string | number))
        ),
      ];
  return (
    <Stack gap={1}>
      <Typography sx={{ paddingTop: 2, paddingLeft: 1 }}>{label}</Typography>
      <Select
        multiple
        placeholder={placeholder}
        onChange={(_, newValues) => {
          if (onChange) onChange(newValues as string[]);
        }}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', gap: '0.25rem' }}>
            {selected.map((selectedOption) => (
              <Chip variant="soft" color="primary">
                {selectedOption.label}
              </Chip>
            ))}
          </Box>
        )}
        sx={{ minWidth: '15rem' }}
        slotProps={{
          listbox: {
            sx: { width: '100%' },
          },
        }}
      >
        {uniqueValues.map((value) => (
          <Option key={value} value={value}>
            {filterThis === 'time'
              ? Number(value) / 60
              : filterThis === 'examType'
                ? t(`components.testCard.examTypes.${value}`)
                : customList
                  ? t(`components.testCard.gradeStatus.${value}`)
                  : value}
          </Option>
        ))}
      </Select>
    </Stack>
  );
};

export default Filter;
