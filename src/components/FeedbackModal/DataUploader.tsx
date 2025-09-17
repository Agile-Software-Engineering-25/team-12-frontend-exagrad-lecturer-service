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
import type { FileReference } from '@/@custom-types/backendTypes';

interface DataUploaderProp {
  files: FileReference[];
  setFiles: (files: FileReference[]) => void;
}

const DataUploader = (props: DataUploaderProp) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);

  const checkValidFile = (incomingFiles: FileReference[]) => {
    const validFiles: FileReference[] = [];

    for (const file of incomingFiles) {
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      props.setFiles([...props.files, ...validFiles]);
    }
  };

  const handleDelete = (indexToDelete: number) => {
    const updatedFiles = props.files.filter(
      (_, index) => index !== indexToDelete
    );
    props.setFiles(updatedFiles);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileReferences: FileReference[] = Array.from(
        event.target.files
      ).map((file) => ({
        fileUuid: crypto.randomUUID(),
        filename: file.name,
        downloadLink: null,
      }));

      checkValidFile(fileReferences);
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
      const fileReferences: FileReference[] = Array.from(
        event.dataTransfer.files
      ).map((file) => ({
        fileUuid: crypto.randomUUID(),
        filename: file.name,
        downloadLink: null,
      }));

      checkValidFile(fileReferences);
    }
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
                cursor: 'pointer',
                bgcolor: isDragging ? 'background.level2' : 'background.level1',
                '&:hover': { bgcolor: 'background.level2' },
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
                borderRadius={50}
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
        <List>
          {props.files.map((file, index) => (
            <ListItem
              sx={{ display: 'flex', justifyItems: 'center' }}
              key={file.filename + index}
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
                  maxWidth: '18vw',
                  textOverflow: 'ellipsis',
                }}
              >
                {file.filename}
              </ListItemContent>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};

export default DataUploader;
