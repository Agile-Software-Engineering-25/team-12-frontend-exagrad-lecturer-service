import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Typography,
} from '@mui/joy';
import UploadIcon from '@mui/icons-material/Upload';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DescriptionIcon from '@mui/icons-material/Description';

interface DataUploaderProp {
  files: File[];
  setFiles: (files: File[]) => void;
  disabled?: boolean;
}

const DataUploader = (props: DataUploaderProp) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      props.setFiles([...props.files, ...selectedFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      const droppedFiles = Array.from(event.dataTransfer.files);
      props.setFiles([...props.files, ...droppedFiles]);
    }
  };

  const handleDelete = (indexToDelete: number) => {
    const updatedFiles = props.files.filter(
      (_, index) => index !== indexToDelete
    );
    props.setFiles(updatedFiles);
  };

  return (
    <>
      {props.files.length === 0 ? (
        <>
          <input
            type="file"
            id="file-upload"
            multiple
            style={{
              position: 'absolute',
              opacity: 0,
              cursor: 'pointer',
              zIndex: 1,
              pointerEvents: 'none',
              background: 'var(--joy-palette-background-level1)',
            }}
            disabled={props.disabled}
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                borderColor: 'neutral.outlinedBorder',
                borderRadius: 'md',
                textAlign: 'center',
                cursor: !props.disabled ? 'pointer' : undefined,
                filter: props.disabled ? 'blur(3px)' : 'none',
                transition: 'filter 0.3s ease',
                bgcolor:
                  !props.disabled && isDragging
                    ? 'background.level2'
                    : 'background.level1',
                '&:hover': !props.disabled
                  ? { bgcolor: 'background.level2' }
                  : {},
              }}
            >
              <Typography
                display="flex"
                flexDirection="column"
                textAlign="center"
                justifyContent="center"
                alignItems="center"
                paddingBlock={4}
                paddingInline={9}
                border={2}
                borderColor="inherit"
                borderRadius={5}
                sx={{
                  borderStyle: 'dashed',
                }}
              >
                <UploadIcon fontSize="large" />
                {t('components.gradeExam.dropFile')}
              </Typography>
            </Box>
          </label>
        </>
      ) : (
        <List
          sx={{
            minWidth: 423,
          }}
        >
          {props.files.map((file, index) => (
            <ListItem
              sx={{ display: 'flex', justifyItems: 'center' }}
              key={file.name + index}
              endAction={
                <IconButton
                  variant="plain"
                  color="danger"
                  onClick={() => handleDelete(index)}
                >
                  <DeleteForeverIcon />
                </IconButton>
              }
            >
              <ListItemDecorator>
                <DescriptionIcon />
              </ListItemDecorator>
              <ListItemContent
                sx={{
                  paddingTop: 0.7,
                  textOverflow: 'ellipsis',
                }}
              >
                {file.name}
              </ListItemContent>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};

export default DataUploader;
