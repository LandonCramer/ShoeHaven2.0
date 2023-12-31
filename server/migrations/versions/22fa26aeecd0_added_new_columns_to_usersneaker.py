"""Added new columns to UserSneaker

Revision ID: 22fa26aeecd0
Revises: 3805c8e04bc9
Create Date: 2024-01-03 22:08:48.772011

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '22fa26aeecd0'
down_revision = '3805c8e04bc9'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cart_sneakers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('brand', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('name', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('color', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('description', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('price', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('image', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('link', sa.String(), nullable=True))

    with op.batch_alter_table('user_sneakers', schema=None) as batch_op:
        batch_op.add_column(sa.Column('brand', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('name', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('color', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('description', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('price', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('image', sa.String(), nullable=True))
        batch_op.add_column(sa.Column('link', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user_sneakers', schema=None) as batch_op:
        batch_op.drop_column('link')
        batch_op.drop_column('image')
        batch_op.drop_column('price')
        batch_op.drop_column('description')
        batch_op.drop_column('color')
        batch_op.drop_column('name')
        batch_op.drop_column('brand')

    with op.batch_alter_table('cart_sneakers', schema=None) as batch_op:
        batch_op.drop_column('link')
        batch_op.drop_column('image')
        batch_op.drop_column('price')
        batch_op.drop_column('description')
        batch_op.drop_column('color')
        batch_op.drop_column('name')
        batch_op.drop_column('brand')

    # ### end Alembic commands ###
