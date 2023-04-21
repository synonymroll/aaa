import {omit} from 'lodash-es';
import {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Text,
  TextInput,
} from '@mantine/core';
import {isNotEmpty, useForm} from '@mantine/form';
import {notifications} from '@mantine/notifications';
import {IconCheck, IconTrash, IconX} from '@tabler/icons-react';

import {ArnieDetailed, ArnieService, Kill} from './api';
import {ArnieFormProvider} from './arnie-form-context';

export default function ArnieDetails() {
  const {id: arnieId} = useParams();
  if (!arnieId) return null;

  const form = useForm<ArnieDetailed>({
    initialValues: {
      name: '',
      killCount: 0,
      kills: [] as Kill[],
    },
    validate: {
      kills: {
        badGuy: isNotEmpty(`What's your real name?`),
      },
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const arnie = await ArnieService.getArnieById(arnieId);
        // controlled inputs must have non-null values
        for (const kill of arnie.kills) {
          kill.oneLiner = kill.oneLiner ?? '';
          kill.weapon = kill.weapon ?? '';
        }
        form.setValues(arnie);
        form.resetDirty(arnie);
      } catch (err) {
        console.warn(err);
        notifications.show({
          message: 'What the fuck did I do wrong?',
          color: 'red',
          icon: <IconX size="1rem" />,
          withBorder: true,
        });
      }
    };
    loadData();
  }, []);

  // focus the `badGuy` input whenever we add a new row
  const [newRow, setNewRow] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [newRow]);

  const onAddKill = () => {
    form.insertListItem('kills', {
      badGuy: '',
      weapon: '',
      oneLiner: '',
    });
    // update `newRow` to trigger a focus on next render
    setNewRow(newRow + 1);
  };

  const onSubmit = async (arnie: ArnieDetailed) => {
    const body = omit(arnie, 'id', 'createdAt', 'updatedAt');
    try {
      await ArnieService.putArnieById(arnieId, body);
      form.resetDirty();
      notifications.show({
        message: 'No problemo',
        color: 'green',
        icon: <IconCheck size="1rem" />,
        withBorder: true,
      });
    } catch (err) {
      console.warn('Save failed', err);
      notifications.show({
        message: 'No deal',
        color: 'red',
        icon: <IconX size="1rem" />,
        withBorder: true,
      });
    }
  };

  const fields = form.values.kills.map((_, i) => (
    <Group key={i} align="flex-start" position="center" mt="md">
      <TextInput sx={{flex: 1}} {...form.getInputProps(`kills.${i}.badGuy`)} ref={inputRef} />
      <TextInput sx={{flex: 1}} {...form.getInputProps(`kills.${i}.weapon`)} />
      <TextInput sx={{flex: 1}} {...form.getInputProps(`kills.${i}.oneLiner`)} />
      <ActionIcon color="red" onClick={() => form.removeListItem('kills', i)}>
        <IconTrash size="1rem" />
      </ActionIcon>
    </Group>
  ));

  return (
    <Box maw={800} mx="auto">
      <ArnieFormProvider form={form}>
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Text ta="center">
            Bad guys killed by <Text span fw={700} fz="lg">{form.values.name}</Text>
          </Text>
          <Group position="center" mt="md">
            <Text weight={500} size="sm" sx={{flex: 1}}>
              Name
            </Text>
            <Text weight={500} size="sm" sx={{flex: 1}}>
              Weapon used
            </Text>
            <Text weight={500} size="sm" sx={{flex: 1}}>
              One liner
            </Text>
            <ActionIcon sx={{visibility:'hidden'}} />
          </Group>
          {fields}
          <Group position="center" mt="md">
            <Button variant="subtle" onClick={onAddKill}>
              Add kill
            </Button>
          </Group>
          <Flex direction="column" align="flex-end">
            <Button type="submit" disabled={!form.isDirty() || !form.isValid()}>Save</Button>
          </Flex>
        </form>
      </ArnieFormProvider>
    </Box>
  );
}
