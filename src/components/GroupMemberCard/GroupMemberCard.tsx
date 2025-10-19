import {
  Box,
  Button,
  Card,
  Input,
  Modal,
  ModalDialog,
  Typography,
} from '@mui/joy';
import CommentIcon from '@mui/icons-material/Comment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Feedback } from '@custom-types/backendTypes.ts';
import { TextField } from '@mui/material';

interface GroupMemberCardProps {
  matriculationNumber: string;
  groupMemberFeedback: Feedback;
  updateGrade: (groupFeedbackUuid: string, newGrade: number) => void;
  updateComment: (groupFeedbackUuid: string, newComment: string) => void;
}

const GroupMemberCard = (props: GroupMemberCardProps) => {
  const [commentOpen, setCommentOpen] = React.useState(false);
  const [comment] = React.useState(props.groupMemberFeedback.comment);

  const { t } = useTranslation();

  return (
    <Card data-testid={'group-member-card'}>
      <Typography level="title-md">{props.matriculationNumber}</Typography>
      <Box display="flex" gap={2}>
        <TextField
          variant="standard"
          defaultValue={props.groupMemberFeedback.grade}
          InputProps={{ disableUnderline: true }}
          sx={{
            width: 30,
            '& input': { padding: 0 },
          }}
          onChange={(e) => {
            props.updateGrade(
              props.groupMemberFeedback.uuid as string,
              Number(e.target.value)
            );
          }}
        />
        <React.Fragment>
          <CommentIcon onClick={() => setCommentOpen(true)} />
          <Modal open={commentOpen} onClose={() => setCommentOpen(false)}>
            <ModalDialog>
              <Input
                placeholder={t('components.gradeExam.comment.placeholder')}
                autoFocus
                defaultValue={comment || ''}
                onChange={(e) =>
                  props.updateComment(
                    props.groupMemberFeedback.uuid as string,
                    e.target.value
                  )
                }
              />
              <Button
                sx={{ mt: 2 }}
                onClick={() => {
                  setCommentOpen(false);
                }}
              >
                {t('components.gradeExam.close')}
              </Button>
            </ModalDialog>
          </Modal>
        </React.Fragment>
      </Box>
    </Card>
  );
};

export default GroupMemberCard;
